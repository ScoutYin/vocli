module.exports = {
	root: true,
	env: {
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
};
