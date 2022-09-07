import fs from 'fs-extra';
import { resolve } from 'path';
import { resolvePackage } from '@vocli/shared';
import type { Answers } from './index';

export const copyTemplate = async (
	projectDir: string,
	{ projectName }: Pick<Answers, 'projectName'>
) => {
	const packagePath = resolvePackage('@vocli/template');
	if (!packagePath) return;

	const templateDir = resolve(packagePath, 'src');

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
