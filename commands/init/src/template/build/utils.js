import fs from 'fs-extra';
import { resolve } from 'path';

/**
 * TODO: __dirname 不是当前文件夹，原因未知
 */
const nms = [
	resolve(import.meta.url, '../node_modules'),
	resolve(process.cwd(), './node_modules'),
	...module.paths,
];

export const resolvePackage = (source, options = {}) => {
	let $path = nms.find((i) => fs.pathExistsSync(resolve(i, source)));

	if (!$path) {
		throw new Error(`@wya/vue-scaffold: 未找到${source}`);
	}

	let fullPath = resolve($path, source);

	return options.read ? fs.readFileSync(fullPath) : fullPath;
};

export const isDev = (value) => {
	return value === 'development';
};

export const isProd = (value) => {
	return value === 'production';
};

export const isBuild = (value) => {
	return value === 'build';
};
