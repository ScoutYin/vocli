// https://esbuild.github.io/api/#build-api
import esbuild from 'esbuild';
import chalk from 'chalk';
import fs from 'fs-extra';
import { resolve } from 'path';
import type { BuildOptions, BuildResult } from 'esbuild';

interface BuildConfig {
	dir: string;
}

const sharedBuildConfig: BuildConfig = {
	dir: 'packages/shared',
};

const commandBuildConfigs: BuildConfig[] = [
	{
		dir: 'commands/init',
	},
];

const vocliBuildConfig: BuildConfig = {
	dir: 'packages/vocli',
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

const build = async () => {
	const buildTasks: Promise<BuildResult>[] = [];

	commandBuildConfigs.forEach((packageConfig) => {
		buildTasks.push(...buildPackage(packageConfig));
	});

	// TODO: build types.

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
