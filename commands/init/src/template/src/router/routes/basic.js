import { Exception } from '@/components/exception';
import { PAGE_NOT_FOUND_NAME } from '../constants';

export const basicModuleNames = ['login'];

export const rootRoute = {
	path: '/',
	name: 'root',
	meta: {
		title: 'root',
	},
	redirect: '/login',
};

const loginRoute = {
	path: '/login',
	name: 'login',
	meta: {
		title: '登录',
	},
	component: () => import('@/modules/login/main/index.vue'),
};

const pageNotFoundRoute = {
	path: '/:path(.*)*',
	name: PAGE_NOT_FOUND_NAME,
	meta: {
		title: '页面不存在',
	},
	component: Exception,
};

// 不需要权限就可以访问的路由
export const basicRoutes = [rootRoute, loginRoute, pageNotFoundRoute];
