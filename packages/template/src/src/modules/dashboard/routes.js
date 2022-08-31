import Layout from '@/layouts/index.vue';

export const routes = {
	path: '/dashboard',
	name: 'dashboard',
	redirect: '',
	meta: {
		icon: 'grid',
		title: 'dashboard',
	},
	component: Layout,
	children: [
		{
			path: 'workbench',
			name: 'dashboardWorkbench',
			meta: {
				title: '工作台',
			},
			components: {
				default: () => import('./workbench/index.vue'),
				sideMenu: true,
				topMenu: true,
			},
		},
	],
};
