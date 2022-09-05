import inquirer from 'inquirer';
import fs from 'fs-extra';
import chalk from 'chalk';
import { resolve } from 'path';
import { createCliConfig } from './create-cli-config.js';
import { copyTemplate } from './copy-template.js';

interface Answers {
	projectName: string;
	projectAlias: string;
}

const prompt = async (): Promise<Answers> => {
	return inquirer.prompt([
		{
			type: 'input',
			message: 'Project name:',
			name: 'projectName',
		},
		{
			type: 'input',
			message: 'Project alias:',
			name: 'projectAlias',
		},
	]);
};

const init = async () => {
	const { projectName, projectAlias } = await prompt();

	const cwd = process.cwd();
	const projectDir = resolve(cwd, projectName);

	if (fs.existsSync(projectDir)) {
		console.log();
		console.log(chalk.yellowBright('This project already exists:'));
		console.log();
		console.log(chalk.yellow(`  - ${projectDir}`));
		console.log();

		const { shouldOverwrite } = await inquirer.prompt([
			{
				type: 'confirm',
				message: 'So, Would you like to overwrite it?',
				name: 'shouldOverwrite',
				default: false,
			},
		]);
		if (shouldOverwrite) {
			await fs.emptyDir(projectDir);
		} else {
			return;
		}
	} else {
		fs.mkdirSync(projectDir);
	}

	copyTemplate(projectDir, { projectName });
	createCliConfig(projectDir, { projectAlias });
};

init();