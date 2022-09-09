import { createRouter, createWebHistory } from 'vue-router';
import { stringifyQuery } from './utils';
import { basicRoutes, getDynamicRoutes, rootRoute } from './routes';
import { setupRouterGuard } from './guard';

export * from './guard';
export * from './routes';

const WHITE_NAME_LIST = [];

const genWhiteList = (routes) => {
	routes.forEach((route) => {
		WHITE_NAME_LIST.push(route.name);
		if (route.children) {
			genWhiteList(route.children);
		}
	});
};
genWhiteList(basicRoutes);

export const router = createRouter({
	history: createWebHistory('/'),
	routes: basicRoutes,
	// 源码在这里会对query中特殊字符进行兑换，像空格 -> '+'
	stringifyQuery,
});

export const resetRouter = () => {
	router.getRoutes().forEach((route) => {
		const { name } = route;
		if (name && !WHITE_NAME_LIST.includes(name) && router.hasRoute(name)) {
			router.removeRoute(name);
		}
	});
};

export const addDynamicRoutes = () => {
	const dynamicRoutes = getDynamicRoutes();
	rootRoute.redirect = dynamicRoutes[0] ? dynamicRoutes[0].path : '/login';
	router.addRoute(rootRoute);
	dynamicRoutes.forEach((route) => {
		!router.hasRoute(route.name) && router.addRoute(route);
	});
};

export const setupRouter = (app) => {
	// TODO: 此时只是调试，实际应该在登录后获取到权限表再添加相应动态路由
	addDynamicRoutes();
	setupRouterGuard(router);
	app.use(router);
};
