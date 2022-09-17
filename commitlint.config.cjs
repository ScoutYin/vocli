module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'type-enum': [
			2,
			'always',
			[
				'build',
				'chore',
				'ci',
				'docs',
				'feat',
				'fix',
				'perf',
				'refactor',
				'revert',
				'style',
				'test',
				'types',
			],
		],
		'subject-case': [
			2,
			'always',
			[
				'lower-case', // default
				'upper-case', // UPPERCASE
				'camel-case', // camelCase
				'kebab-case', // kebab-case
				'pascal-case', // PascalCase
				'sentence-case', // Sentence case
				'snake-case', // snake_case
				'start-case', // Start Case
			],
		],
	},
};
