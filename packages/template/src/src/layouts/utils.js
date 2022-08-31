/**
 * 解析得到给定路由 path 的祖先路由 path
 * 如：
 * 解析一级 getParentRoutePath('/shop/product/main/editor', 1) -> '/shop'
 * 解析二级 getParentRoutePath('/shop/product/main/editor', 2) -> '/shop/product'
 * 解析三级 getParentRoutePath('/shop/product/main/editor', 3) -> '/shop/product/main'
 * @param {*} path
 * @param {*} level
 * @returns
 */
export const getParentRoutePath = (path, level = 1) => {
	const result = path.match(new RegExp(`((?:/[a-z]+[a-z0-9-]*){${level}})(?:/[a-z]+[a-z0-9-])+`));
	return result && result[1];
};
