import inquirer from 'inquirer';
import fs from 'fs-extra';
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
			default: '@vocli/add',
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
	const packageDirName = packageName.replace(/@vocli\//, '');

	const dirPath = resolve(cwd, dir, packageDirName);
	const dest = resolve(dirPath, 'package.json');

	if (fs.existsSync(dest)) {
		// TODO
	} else {
		fs.mkdirSync(dirPath);
	}

	const packageJsonTpl = await fs.readFile(TPL_FILE, 'utf-8');
	const packageJson = JSON.parse(packageJsonTpl);

	packageJson.name = packageName;
	packageJson.description = answers.description;
	packageJson.homepage += `/${dir}`;
	if (packageName) {
		const name = packageName.replace(new RegExp(SCOPE), '');
		packageJson.repository.directory = dir + name;
	}

	fs.writeFile(dest, JSON.stringify(packageJson));
};

createPackage();
