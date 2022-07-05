module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
		es2021: true,
	},
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
	],
	// 规则覆盖
	rules: {
		'prettier/prettier': 'warn',
		'@typescript-eslint/no-unused-vars': 'error',
	},
	overrides: [
		{
			files: ['build/*.js'],
			rules: {
				'@typescript-eslint/no-var-requires': 0,
			},
		},
	],
};
