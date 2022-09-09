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
		'@typescript-eslint/no-empty-function': 'off',
	},
	overrides: [
		{
			files: ['commands/init/src/template/**/*.js'],
			rules: {
				'@typescript-eslint/no-unused-vars': 'warn',
			},
		},
	],
};
