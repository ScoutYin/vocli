// https://esbuild.github.io/api/#build-api
import esbuild from 'esbuild';
import chalk from 'chalk';
import fs from 'fs-extra';
import { resolve } from 'path';
import type { BuildOptions, BuildResult } from 'esbuild';

interface BuildConfig {
	dir: string;
}

const packageBuildConfigs: BuildConfig[] = [
	{
		dir: 'commands/init',
	},
	{
		dir: 'packages/shared',
	},
	{
		dir: 'packages/vocli',
	},
];

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

const build = async () => {
	const buildTasks: Promise<BuildResult>[] = [];

	packageBuildConfigs.forEach((pkg) => {
		const buildCommonOptions: BuildOptions = {
			entryPoints: [`${pkg.dir}/src/index.ts`],
			bundle: true,
			platform: 'node',
			target: 'node14.16.0',
			outdir: `${pkg.dir}/dist`,
		};

		buildTasks.push(
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
			})
		);
	});

	// TODO: build types.

	await Promise.all([...buildTasks, copyTemplate()]);

	console.log(chalk.green(`  Build succeeded!`));
	console.log();
};

build();
