import fs from 'fs-extra';
import { resolve } from 'path';

export const createCliConfig = async (projectDir: string, { projectAlias }) => {
	const config = { projectAlias };
	const cliConfigPath = resolve(projectDir, 'vocli.config.js');

	await fs.writeFile(cliConfigPath, `export default ${JSON.stringify(config, null, 2)}`);
};
