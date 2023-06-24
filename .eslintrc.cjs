module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
		'prettier'
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	ignorePatterns: ['*.cjs'],
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		},
		{
			files: ['*.ts', '*.svelte'],
			rules: {
				'no-undef': 'off'
			}
		}
	],
	rules: {
		'@typescript-eslint/no-non-null-assertion': 'off',
		'svelte/no-at-html-tags': 'off',
		'@typescript-eslint/no-empty-interface': [
			'error',
			{
				allowSingleExtends: true
			}
		],
		'@typescript-eslint/no-unused-vars': [
			'warn',
			{
				varsIgnorePattern: '\\$\\$Events'
			}
		]
	}
};
