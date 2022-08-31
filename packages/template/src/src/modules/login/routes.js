export const routes = {
	path: '/login',
	name: 'login',
	meta: {
		title: '登录',
	},
	component: () => import('./main/index.vue'),
};
