import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import module from 'node:module';

const generatePaging = async () => {
	const requireForVocli = module.createRequire(resolve(process.cwd(), 'node_modules'));
	const requireForVocliSubPkg = module.createRequire(requireForVocli.resolve('vocli'));
	const createCmdPkgPath = requireForVocliSubPkg.resolve('@vocli/create');

	const vueFile = await readFile(
		resolve(createCmdPkgPath, '../../', 'template/paging/basic-index.vue'),
		'utf-8'
	);
	console.log(vueFile);
};

export default generatePaging;
