import inquirer from 'inquirer';
import fs from 'fs-extra';
import chalk from 'chalk';
import { resolve } from 'path';

const WORKSPACE_DIRS = ['commands/', 'packages/'] as const;

interface Answers {
	dir: typeof WORKSPACE_DIRS[number];
	packageName: string;
	description: string;
}

const cwd = process.cwd();

const SCOPE = '@vocli/';
const TPL_FILE = resolve(cwd, 'scripts/package-tpl.json');

const prompt = async (): Promise<Answers> => {
	return inquirer.prompt([
		{
			type: 'list',
			message: 'Which directory do you want to create in?',
			name: 'dir',
			choices: WORKSPACE_DIRS,
		},
		{
			type: 'input',
			message: 'Package name:',
			name: 'packageName',
		},
		{
			type: 'input',
			message: 'Package description:',
			name: 'description',
			default: (answers: Answers) => answers.packageName,
		},
	]);
};

const createPackage = async () => {
	const answers = await prompt();

	const { dir, packageName } = answers;
	const packageDirName = packageName.replace(new RegExp(SCOPE), '');

	const dirPath = resolve(cwd, dir, packageDirName);
	const dest = resolve(dirPath, 'package.json');

	if (fs.existsSync(dest)) {
		console.log();
		console.log(chalk.yellowBright('This file already exists:'));
		console.log();
		console.log(chalk.yellow(`  - ${dest}`));
		console.log();

		const { shouldOverwrite } = await inquirer.prompt([
			{
				type: 'confirm',
				message: 'So, Would you like to overwrite it?',
				name: 'shouldOverwrite',
				default: false,
			},
		]);
		if (!shouldOverwrite) {
			return;
		}
	} else {
		fs.mkdirSync(dirPath);
	}

	const packageJsonTpl = await fs.readFile(TPL_FILE, 'utf-8');
	const packageJson = JSON.parse(packageJsonTpl);

	packageJson.name = packageName;
	packageJson.description = answers.description;
	packageJson.homepage += `/${dir}`;
	if (packageDirName) {
		packageJson.repository.directory = dir + packageDirName;
	}

	fs.writeFile(dest, JSON.stringify(packageJson));
};

createPackage();
