import fs from 'fs-extra';
import { resolve } from 'path';
import type { Answers } from './index.js';

export const createCliConfig = async (
	projectDir: string,
	options: Pick<Answers, 'projectAlias'>
) => {
	const config = options;
	const cliConfigPath = resolve(projectDir, 'vocli.config.js');

	await fs.writeFile(cliConfigPath, `export default ${JSON.stringify(config, null, 2)}`);
};
