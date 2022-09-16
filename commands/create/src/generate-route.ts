import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { routePathToPaths, routePathToDir } from './utils';
import { resolve, dirname } from 'path';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import type { Answers } from './prompt';
import type * as T from '@babel/types';
import generate from '@babel/generator';

const pathsToName = (paths: string[]) => {
	return paths.reduce((name, curr, index) => {
		if (index === 0) return curr;
		return `${name}${curr.replace(/^\w/, (match) => match.toUpperCase())}`;
	}, '');
};

const getDefaultComponent = (paths: string[]) => {
	return `./${paths.slice(1).join('-')}/index.vue`;
};

/**
 * Generate route config in routes.js.
 */
const generateRoute = async (answers: Answers) => {
	const paths = routePathToPaths(answers.routePath);
	const pageDirPath = routePathToDir(answers.routePath);
	const moduleName = paths[0];
	const moduleDirPath = dirname(pageDirPath);
	const routeJsPath = resolve(moduleDirPath, 'routes.js');

	try {
		const routesConfigFile = await readFile(routeJsPath, 'utf-8');
		// Ensure the outside `catch` only capture errors from `readFile`
		try {
			const ast = parser.parse(routesConfigFile, { sourceType: 'module' });

			let depth = 0;
			let stop = false;
			let commonChildrenNode: T.ArrayExpression;

			const visitors = {
				ArrayExpression: {
					enter(path: any) {
						depth++;

						if (stop) return;

						const target = (path.node as T.ArrayExpression).elements.find(
							(el: T.ObjectExpression) => {
								const propNode = el.properties.find(
									(prop: T.ObjectProperty) => (prop.key as T.Identifier).name === 'path'
								);
								return (
									((propNode as T.ObjectProperty).value as T.StringLiteral).value === paths[depth]
								);
							}
						);

						// path exists, do nothing.
						if (target && depth + 1 === paths.length) {
							stop = true;
							console.warn(`Route "${answers.routePath}" exists, will do nothing.`);

							return;
						}

						commonChildrenNode = path.node;

						// Can't find target, means a new branch.
						if (!target) {
							// Prevent searching child nodes.
							stop = true;

							const generateBranch = (_paths: string[]) => {
								const properties = [
									t.objectProperty(t.identifier('path'), t.stringLiteral(_paths[0])),
									t.objectProperty(
										t.identifier('name'),
										t.stringLiteral(pathsToName(paths.slice(0, paths.length - _paths.length)))
									),
									t.objectProperty(
										t.identifier('meta'),
										t.objectExpression([
											t.objectProperty(
												t.identifier('title'),
												t.stringLiteral(_paths.length > 1 ? '' : answers.pageTitle)
											),
										])
									),
								];

								if (_paths.length > 1) {
									properties.push(
										t.objectProperty(
											t.identifier('children'),
											t.arrayExpression([generateBranch(_paths.slice(1))])
										)
									);
								} else {
									// The last level branch.
									properties.push(
										t.objectProperty(
											t.identifier('components'),
											t.objectExpression([
												t.objectProperty(
													t.identifier('default'),
													t.arrowFunctionExpression(
														[],
														t.callExpression(t.import(), [
															t.stringLiteral(getDefaultComponent(paths)),
														])
													)
												),
												t.objectProperty(
													t.identifier('sideMenu'),
													t.booleanLiteral(answers.withSideMenu)
												),
												t.objectProperty(
													t.identifier('topMenu'),
													t.booleanLiteral(answers.withTopMenu)
												),
											])
										)
									);
								}
								return t.objectExpression(properties);
							};
							commonChildrenNode.elements.push(generateBranch(paths.slice(depth)));
						}
					},
					exit() {
						depth--;
					},
				},
			};
			traverse(ast, visitors);

			const result = generate(ast);

			await writeFile(routeJsPath, result.code);
		} catch (error) {
			console.log(error);
		}
	} catch (error) {
		// Add a new module
		const routesConfig = `import Layout from '@/layouts/index.vue';\n
		export const routes = {
			path: '/${moduleName}',
			name: '${moduleName}',
			meta: {
				icon: 'placeholder',
				title: '',
			},
			component: Layout,
			children: [
				{
					path: '${paths[1]}',
					name: '${pathsToName(paths.slice(0, 2))}',
					meta: {
						title: '',
					},
					children: [
						{
							path: '${paths[2]}',
							name: '${pathsToName(paths.slice(0, 3))}',
							meta: {
								title: '${answers.pageTitle}',
							},
							components: {
								default: () => import('${getDefaultComponent(paths)}'),
								sideMenu: ${answers.withSideMenu},
								topMenu: ${answers.withTopMenu},
							},
						},
					],
				},
			],
		};`;

		await mkdir(moduleDirPath, { recursive: true });
		await writeFile(routeJsPath, routesConfig);
	}
};

export default generateRoute;
