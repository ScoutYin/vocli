import fs from 'fs-extra';
import { resolve } from 'path';
// import { createRequire } from 'node:module';
import type { Answers } from './index';

export const copyTemplate = async (
	projectDir: string,
	{ projectName }: Pick<Answers, 'projectName'>
) => {
	// console.log(process.cwd());

	// const require = createRequire(process.cwd());

	// console.log(require.resolve.paths('@vocli/init'));
	// const templatePackageDir = require.resolve('@vocli/init');

	// console.log(templatePackageDir, '--templatePackageDir--');

	// if (!templatePackageDir) return;

	// const templateDir = resolve(templatePackageDir, 'template');
	const templateDir = resolve(import.meta.url, './template');
	console.log(import.meta.url, 'import.meta.url');
	console.log(templateDir, '---templateDir--');

	await fs.copy(templateDir, projectDir, {
		filter: (src, dest) => {
			return !dest.includes('node_modules') && !dest.includes('/.pnpm-debug.log');
		},
	});

	// 修改项目 package.json 中的 name 字段为用户输入的项目名
	const packageJsonPath = resolve(projectDir, 'package.json');
	const packageJsonTpl = await fs.readFile(packageJsonPath, 'utf-8');
	const packageJson = JSON.parse(packageJsonTpl);
	packageJson.name = projectName;
	await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
};
