module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
		es6: true,
		mocha: true,
		'vue/setup-compiler-macros': true,
	},

	parser: 'vue-eslint-parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	},

	// 四个级别： base/essential/strongly-recommended/recommended, 使用最高约束
	extends: [
		'eslint:recommended',
		'airbnb-base',
		'plugin:vue/vue3-recommended',
		'plugin:prettier/recommended',
	],
	plugins: ['markdown', 'vue'],
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.js', '.vue'],
			},
		},
	},
	globals: {
		_global: 'readonly',
	},
	rules: {
		'prettier/prettier': 'warn',
		// vue https://github.com/vuejs/eslint-plugin-vue
		'vue/html-indent': ['warn', 'tab'],
		'vue/max-attributes-per-line': [
			'warn',
			{
				singleline: 4, // 一行最多四个
				multiline: 1,
			},
		],
		'vue/require-default-prop': 0, // 可以不提供组件 prop 的默认值
		'vue/component-definition-name-casing': ['warn', 'PascalCase'],
		'vue/component-name-in-template-casing': ['warn', 'PascalCase'],
		'vue/multi-word-component-names': 'off',
		camelcase: 0,
		'dot-notation': 0,
		'new-parens': ['warn'],
		'no-mixed-spaces-and-tabs': ['warn', 'smart-tabs'],
		'object-curly-newline': 0, // { a, b, c } 允许不换行
		'arrow-body-style': 0, // a => 1
		'arrow-parens': 0, // a => 1
		'quote-props': ['warn', 'as-needed'], // 'a-b': false
		'guard-for-in': 0, // xx.hasOwnProperty(key)
		'no-restricted-syntax': 0,
		'global-require': 0,
		eqeqeq: 0,
		'no-plusplus': 0,
		'no-unused-expressions': 0,
		'no-undef': ['error'],
		'no-unused-vars': 'warn',
		'import/no-extraneous-dependencies': 0,
		'import/prefer-default-export': 0,
		'import/newline-after-import': ['warn'],
		'import/first': 0,
		'import/no-unresolved': 0,
		'import/extensions': 0,
		'no-restricted-globals': 0,
		'no-param-reassign': 0,
		'consistent-return': 0,
		'prefer-const': 0,
		'no-else-return': 1,
		'func-names': 0,
		'prefer-arrow-callback': 0,
		'no-bitwise': 0,
		'padded-blocks': 0, // {} 允许空行
		'no-return-assign': 0,
		'max-len': ['warn', { code: 150, ignoreComments: true }],
		'prefer-destructuring': 0,
		'prefer-template': 0,
		'no-nested-ternary': 0,
		'prefer-rest-params': 0,
		'class-methods-use-this': 0,
		'no-tabs': 0,
		quotes: 0,
		'no-console': 0,
		'no-debugger': 1,
		'no-var': 1,
		'import/named': 0,
		semi: [1, 'always'],
		'no-trailing-spaces': 0,
		'eol-last': 0,
		'no-underscore-dangle': 0,
		'no-alert': 0,
		'no-lone-blocks': 0,
		// 关键字周围强制使用空格
		'keyword-spacing': [
			'error',
			{
				before: true,
				after: true,
			},
		],
		// 大括号中强制使用空格
		'object-curly-spacing': ['warn', 'always'],
		// 单行代码块前后要加空格
		'block-spacing': ['warn', 'always'],
		// 逗号后面加空格
		'comma-spacing': [
			'warn',
			{
				before: false,
				after: true,
			},
		],
		// 分号后面加空格
		'semi-spacing': [
			'warn',
			{
				before: false,
				after: true,
			},
		],
		// 在注释前有空白
		'spaced-comment': ['warn', 'always'],
		// 箭头函数前后要有空格
		'arrow-spacing': [
			'warn',
			{
				before: true,
				after: true,
			},
		],
		// 对象字面量的属性中键和值之间使用一致的间距
		'key-spacing': [
			'warn',
			{
				beforeColon: false,
				afterColon: true,
			},
		],
		// 要求操作符周围有空格
		'space-infix-ops': [
			'warn',
			{
				int32Hint: false,
			},
		],
		'jsx-quotes': 1,
	},
};
