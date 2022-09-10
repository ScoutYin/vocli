import cac from 'cac';
import type { Cli, CommandRegister } from '@vocli/shared';
import initCmd from '@vocli/init';

class Vocli {
	cli: Cli;

	constructor() {
		this.cli = cac('vocli');
	}

	/**
	 * register command
	 * @param commandRegister
	 * @returns Vocli instance
	 */
	command(commandRegister: CommandRegister) {
		commandRegister(this.cli);
		return this;
	}

	help() {
		return this.cli.help();
	}

	parse() {
		return this.cli.parse();
	}
}

export default () => {
	const vocli = new Vocli();

	vocli.command(initCmd);

	vocli.help().parse();
};
