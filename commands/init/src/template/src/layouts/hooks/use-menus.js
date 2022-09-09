import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { parseRouteTrees, dynamicRouteTrees } from '@/router';
import { getParentRoutePath } from '../utils';

export const useMenus = () => {
	const route = useRoute();
	let menusRef = [];
	let flattedRoutes = [];

	const genMenus = () => {
		const result = parseRouteTrees(dynamicRouteTrees);

		menusRef = result.menuTrees;
		flattedRoutes = result.flattedRoutes;
	};
	genMenus();

	const visibleMenus = computed(() => {
		return menusRef.filter((it) => !it.proxy);
	});

	const findChunk = (path) => flattedRoutes.find((it) => it.path === path);

	const activeChain = computed(() => {
		const stack = [];
		// 当前路由对应的最后一级导航路由
		// 如果当前路由本身是导航路由，则将其本身作为最后一级导航路由向上找
		// 否则说明当前路由是超过 3 级的路由，则查找当前路由对应的的三级导航路由（对应为 route.meta.parentPath）
		const theLastOnePath =
			route.meta.navigation > 0
				? route.path
				: // 可配置对应路由的 route.meta.parentPath 属性来自定义归属的三级导航 path，默认通过当前 path 截取识别
				  route.meta.parentPath;

		// 查找归属的最后一级导航
		let chunk = theLastOnePath && findChunk(theLastOnePath);
		let level = 3;
		while (!chunk && level > 0) {
			chunk = findChunk(getParentRoutePath(route.path, level--));
		}

		if (!chunk && process.env.NODE_ENV === 'development') {
			throw new Error(`${route.path}路由命名不合法，请检查！`);
		}

		while (chunk) {
			stack.unshift(chunk);
			chunk = chunk.parent;
		}

		return stack;
	});

	// 真实模块归属关系上的一级导航模块
	const realOneLevelChunk = computed(() => {
		return activeChain.value[1]?.shadowParent || activeChain.value[1]?.parent;
	});

	// 可见的二级导航菜单
	const visibleChildMenus = computed(() => {
		const childMenus = realOneLevelChunk.value?.children || [];
		return childMenus.filter((menu) => {
			return typeof menu.hide === 'function' ? !menu.hide() : !menu.hide;
		});
	});

	return {
		activeChain,
		visibleMenus,
		realOneLevelChunk,
		visibleChildMenus,
	};
};
