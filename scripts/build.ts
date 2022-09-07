// https://esbuild.github.io/api/#build-api
import esbuild from 'esbuild';
import chalk from 'chalk';
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
				outExtension: {
					'.js': '.mjs',
				},
			}),
			// for CommonJS
			esbuild.build({
				...buildCommonOptions,
				format: 'cjs',
				outExtension: {
					'.js': '.cjs',
				},
			})
		);
	});

	// TODO: build types.

	await Promise.all(buildTasks);

	console.log(chalk.green(`  Build succeeded!`));
	console.log();
};

build();
