import { Global } from '@/config';

export const createPermissionGuard = (router) => {
	router.beforeEach((to) => {
		if (Global.isLoggedIn()) {
			// 已登录，不可跳转登录
			return to.path !== '/login';
		}
		// 未登录，如果目标页不需要登录，则允许进入；
		// 否则跳转登录
		return to.meta.escapeLogin || to.name === 'login' || '/login';
	});
};
