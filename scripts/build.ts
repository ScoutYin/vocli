// https://esbuild.github.io/api/#build-api
import esbuild from 'esbuild';
import chalk from 'chalk';
import fs from 'fs-extra';
import { resolve } from 'path';
import { Extractor, ExtractorConfig } from '@microsoft/api-extractor';
import type { BuildOptions, BuildResult } from 'esbuild';

interface BuildConfig {
	dir: string;
	unscopedPackageName: string;
}

const sharedBuildConfig: BuildConfig = {
	dir: 'packages/shared',
	unscopedPackageName: 'shared',
};

const commandBuildConfigs: BuildConfig[] = [
	{
		dir: 'commands/init',
		unscopedPackageName: 'init',
	},
];

const vocliBuildConfig: BuildConfig = {
	dir: 'packages/vocli',
	unscopedPackageName: 'vocli',
};

/**
 * Move `commands/init/src/template` to packages/vocli/dist/template
 */
const copyTemplate = async () => {
	const vocliTemplatePath = resolve('packages/vocli/dist/template');
	if (fs.pathExistsSync(vocliTemplatePath)) {
		await fs.emptyDir(vocliTemplatePath);
	} else {
		fs.mkdir(vocliTemplatePath);
	}
	const initCmdTemplatePath = resolve('commands/init/src/template');
	await fs.copy(initCmdTemplatePath, vocliTemplatePath, {
		filter: (src, dest) => {
			return !dest.includes('node_modules') && !dest.includes('/.pnpm-debug.log');
		},
	});
};

const buildPackage = (packageConfig: BuildConfig) => {
	const buildCommonOptions: BuildOptions = {
		entryPoints: [`${packageConfig.dir}/src/index.ts`],
		bundle: true,
		platform: 'node',
		target: 'node14.16.0',
		outdir: `${packageConfig.dir}/dist`,
	};

	return [
		// for ESM
		esbuild.build({
			...buildCommonOptions,
			format: 'esm',
			tsconfig: 'tsconfig.esm.json',
			outExtension: {
				'.js': '.mjs',
			},
		}),
		// for CommonJS
		esbuild.build({
			...buildCommonOptions,
			format: 'cjs',
			tsconfig: 'tsconfig.cjs.json',
			outExtension: {
				'.js': '.cjs',
			},
			// `import.meta.url` is not supported in CommonJS，replace whit `__dirname`
			define: {
				'import.meta.url': '__dirname',
			},
		}),
	];
};

const buildTypes = () => {
	[sharedBuildConfig, ...commandBuildConfigs, vocliBuildConfig].forEach((packageConfig) => {
		const apiExtractorJsonPath = resolve(packageConfig.dir, 'api-extractor.json');
		const extractorConfig = ExtractorConfig.loadFileAndPrepare(apiExtractorJsonPath);
		const extractorResult = Extractor.invoke(extractorConfig, {
			localBuild: true,
			showVerboseMessages: true,
		});

		if (extractorResult.succeeded) {
			console.log(
				chalk.bold(
					chalk.green(
						`API Extractor: ${packageConfig.unscopedPackageName}.d.ts generated successfully.`
					)
				)
			);
		} else {
			console.error(
				`API Extractor completed with ${extractorResult.errorCount} errors` +
					` and ${extractorResult.warningCount} warnings`
			);
			process.exitCode = 1;
		}
	});

	fs.remove(resolve(process.cwd(), 'dist'));
};

const build = async () => {
	const buildTasks: Promise<BuildResult>[] = [];

	commandBuildConfigs.forEach((packageConfig) => {
		buildTasks.push(...buildPackage(packageConfig));
	});

	buildTypes();

	// build shared package, as a dependence, so it needs build first.
	await Promise.all(buildPackage(sharedBuildConfig));

	// build commands
	await Promise.all([...buildTasks, copyTemplate()]);

	// build vocli package, it depends on all packages, so build it at last.
	await Promise.all(buildPackage(vocliBuildConfig));

	console.log(chalk.green(`  Build succeeded!`));
	console.log();
};

build();
