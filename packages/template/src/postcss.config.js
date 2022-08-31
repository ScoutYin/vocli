module.exports = {
	plugins: [
		/**
		 * https://github.com/postcss/postcss-import
		 * 将样式中 @import 规则（引用 css、scss 等文件）转换成内联的内容（真实的样式代码）
		 */
		require('postcss-import')(),

		/**
		 * https://github.com/cssnano/cssnano
		 * 通过分析 CSS 代码，在不改变代码原意的前提下，尽可能进行优化，以减小代码体积
		 */
		require('cssnano')(),

		/**
		 * https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env
		 * 将现代的 CSS 转换为大多数浏览器能理解的内容，
		 * 以及根据目标浏览器或运行时环境确定所需的 polyfill
		 * 内部已集成了 autoprefixer，
		 * 如需对 autoprefixer 进行配置：
		 * require('postcss-preset-env')({
		 * 	autoprefixer: { ... autoprefixer 配置 }
		 * })
		 */
		require('postcss-preset-env')(),
	],
};
