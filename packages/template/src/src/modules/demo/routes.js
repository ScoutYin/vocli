import Layout from '@/layouts/index.vue';

export const routes = {
	path: '/demo',
	name: 'demo',
	meta: {
		icon: 'celveguanli',
		title: '页面',
	},
	component: Layout,
	children: [
		{
			path: 'paging',
			name: 'demoPaging',
			meta: {
				title: '列表',
			},
			children: [
				{
					path: 'basic',
					name: 'demoPagingBasic',
					meta: {
						title: '基础列表',
					},
					components: {
						default: () => import('./paging-basic/index.vue'),
						sideMenu: true,
						topMenu: true,
					},
				},
				{
					path: 'tabs',
					name: 'demoPagingTabs',
					meta: {
						title: 'tabs列表',
					},
					components: {
						default: () => import('./paging-tabs/index.vue'),
						sideMenu: true,
						topMenu: true,
					},
				},
			],
		},
		{
			path: 'form',
			name: 'demoForm',
			meta: {
				title: '表单',
			},
			children: [
				{
					path: 'basic',
					name: 'demoFormBasic',
					meta: {
						title: '基础表单',
					},
					components: {
						default: () => import('./form-basic/index.vue'),
						sideMenu: true,
						topMenu: true,
					},
				},
				{
					path: 'step',
					name: 'demoFormStep',
					meta: {
						title: '带操作步骤的表单',
					},
					components: {
						default: () => import('./form-step/index.vue'),
						sideMenu: true,
						topMenu: true,
					},
				},
			],
		},
	],
};
