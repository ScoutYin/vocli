import type { CommandRegister } from '@vocli/shared';
// import prompt from './prompt';
// import generateRoute from './generate-route';
import generatePaging from './generate-paging';

export interface CreateCmdOptions {
	configPath: string;
}

const create = async (options: CreateCmdOptions) => {
	console.log(options);
	// const answers = await prompt();
	// generateRoute(answers);
	generatePaging();
};

const commandRegister: CommandRegister = (cli) => {
	cli
		.command('create', 'Create page')
		.option('--config <configPath>', 'Use a custom config file')
		.action((options: CreateCmdOptions) => {
			create(options);
		});
};

export default commandRegister;
