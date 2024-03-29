import { resolve, dirname } from 'path';
import fs from 'fs-extra';

export const resolvePackage = (pkgName: string) => {
	const cwd = process.cwd();

	const _find = (pkgPath: string): string | null => {
		if (fs.existsSync(pkgPath)) {
			return pkgPath;
		}
		const lastDir = dirname(dirname(pkgPath));
		return fs.existsSync(lastDir) ? _find(resolve(lastDir, 'node_modules', pkgName)) : null;
	};
	return _find(resolve(cwd, 'node_modules', pkgName));
};
