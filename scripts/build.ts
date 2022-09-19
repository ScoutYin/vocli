// https://esbuild.github.io/api/#build-api
import esbuild from 'esbuild';
import chalk from 'chalk';
import fs from 'fs-extra';
import { resolve } from 'path';
import { Extractor, ExtractorConfig } from '@microsoft/api-extractor';
import type { BuildOptions } from 'esbuild';
import { execa } from 'execa';

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
	{
		dir: 'commands/create',
		unscopedPackageName: 'create',
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
		fs.mkdir(vocliTemplatePath, { recursive: true });
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

const buildTypes = async (packageConfig) => {
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

	fs.remove(resolve(packageConfig.dir, 'dist/types'));
};

const build = async (packageConfig) => {
	const distDir = resolve(packageConfig.dir, 'dist');
	if (fs.pathExistsSync(distDir)) {
		await fs.emptyDir(distDir);
	} else {
		fs.mkdir(distDir);
	}

	buildPackage(packageConfig);

	await execa('tsc', [
		'-p',
		`${packageConfig.dir}/tsconfig.json`,
		'--outDir',
		`${packageConfig.dir}/dist/types`,
		'--skipLibCheck', // faster
	]);

	await buildTypes(packageConfig);
};

const runBuild = async () => {
	console.time('build');

	copyTemplate();

	// As a dependence, so it needs build first.
	await build(sharedBuildConfig);
	await Promise.all(commandBuildConfigs.map((packageConfig) => build(packageConfig)));
	// It depends on all packages, so build it at last.
	await build(vocliBuildConfig);

	console.log();
	console.log(chalk.green(`  Build succeeded!`));
	console.log();

	console.timeEnd('build');
};

runBuild();
