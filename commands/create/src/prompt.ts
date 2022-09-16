import inquirer from 'inquirer';

const PAGE_TYPES = ['empty', 'paging', 'form'] as const;
const PAGING_TYPES = ['basic', 'tabs'] as const;
const FORM_TYPES = ['basic', 'steps'] as const;

export interface Answers {
	pageType: typeof PAGE_TYPES[number];
	pagingType: typeof PAGING_TYPES[number];
	formType: typeof FORM_TYPES[number];
	pageTitle: string;
	routePath: string;
	withSideMenu: boolean;
	withTopMenu: boolean;
}

const prompt = (): Promise<Answers> => {
	return inquirer.prompt([
		{
			type: 'list',
			message: 'Page type:',
			name: 'pageType',
			choices: PAGE_TYPES,
			default: 'empty',
		},
		{
			type: 'list',
			message: 'Paging type:',
			name: 'pagingType',
			choices: PAGING_TYPES,
			when: (answers) => answers.pageType === 'paging',
		},
		{
			type: 'list',
			message: 'Form type:',
			name: 'formType',
			choices: FORM_TYPES,
			when: (answers) => answers.pageType === 'form',
		},
		{
			type: 'input',
			message: 'Page title:',
			name: 'pageTitle',
			default: '测试测试',
		},
		{
			type: 'input',
			message: 'Route path:',
			name: 'routePath',
			default: '/test/cmd/xxx',
		},
		{
			type: 'confirm',
			message: 'With side menu?',
			name: 'withSideMenu',
		},
		{
			type: 'confirm',
			message: 'With top menu?',
			name: 'withTopMenu',
		},
	]);
};

export default prompt;
