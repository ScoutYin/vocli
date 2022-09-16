import { resolve } from 'path';

export const routePathToPaths = (routePath: string) =>
	routePath.split('/').filter((name) => name !== '');

export const routePathToDir = (routePath: string) => {
	const paths = routePathToPaths(routePath);
	const moduleName = paths[0];
	const pageDirName = paths.slice(1).join('-');
	return resolve(process.cwd(), 'src/modules', moduleName, pageDirName);
};
