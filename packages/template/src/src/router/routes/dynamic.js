import { basicModuleNames } from './basic';
import { Global } from '@/config';
import { normalizeRoute } from '../utils';

const MENU_DEPTH = 3;

const resolveRoutes = () => {
	const modules = import.meta.globEager('../../modules/*/index.js');
	return Object.values(modules).reduce((routes, mod) => {
		if (!basicModuleNames.includes(mod.routes.name)) {
			routes.push(mod.routes);
		}
		return routes;
	}, []);
};

// 需要根据登录后的账号权限进行分配的动态路由
export const dynamicRouteTrees = resolveRoutes();

export const parseRouteTrees = (routeTrees) => {
	// 代理模块查找缓存
	const proxyCache = {};
	// 导航层级深度
	let depth = 1;

	const parse = (modules, parent = null, shadowParent = null) => {
		const parentPath = shadowParent ? shadowParent.path : parent ? parent.path : '';
		return modules.reduce(
			(result, module) => {
				const { auth, children, proxy, ...config } = module;
				if (!Global.hasAuth(auth)) return result;

				if (!config.path.startsWith('/')) {
					config.path = `${parentPath}/${config.path}`;
				}

				let realModule;
				// 如果配置了同级导航代理，则 realModule 应为代理模块
				if (proxy) {
					realModule = proxyCache[proxy];
					if (!realModule) {
						realModule = modules.find((mod) => mod.path === proxy);
						// 更新查找缓存
						proxyCache[proxy] = realModule;
					}
					config.proxy = realModule;
					config.shadow = true;
				}

				// 父级导航
				config.parent = parent;
				// 幽灵父导航，不作为导航菜单，但是存在模块归属关系
				config.shadowParent = shadowParent;
				config.meta = config.meta || {};
				// 导航层级标识
				config.meta.navigation = depth > MENU_DEPTH ? 0 : depth;
				// 路由激活时需隐藏的导航层级，比如 hiddenMenus = [2] 则表示隐藏二级导航
				config.meta.hiddenMenus = config.meta.hiddenMenus || [];

				if (children && children.length > 0) {
					if (!realModule) {
						realModule = config;
					}

					depth++;
					// realModule 作为子级的 parent
					const res = parse(children, realModule, config.shadow ? config : null);
					depth--;

					// 子菜单
					config.children = res.menuTrees;

					// 如果该导航存在可访问的子导航才认为该导航有权限访问
					if (res.menuTrees.length) {
						result.flattedRoutes.push(config, ...res.flattedRoutes);
						// 最多三级导航菜单
						if (depth <= MENU_DEPTH) {
							result.menuTrees.push(config);
						}
					}
				} else {
					// 如果没有children，说明是最后一级（3级）导航，存在对它的访问权限就行
					result.flattedRoutes.push(config);
					if (depth <= MENU_DEPTH) {
						result.menuTrees.push(config);
					}
				}
				normalizeRoute(config);
				return result;
			},
			{ menuTrees: [], flattedRoutes: [] }
		);
	};

	return parse(routeTrees);
};

export const getDynamicRoutes = () => {
	const { flattedRoutes } = parseRouteTrees(dynamicRouteTrees);
	return flattedRoutes;
};
