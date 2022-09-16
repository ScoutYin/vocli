declare function babelTraverse(ast: object, opts?: object): void;

declare function babelGenerator(ast: object, opts?: object): { code: string };

declare module '@babel/traverse' {
	export default babelTraverse;
}

declare module '@babel/generator' {
	export default babelGenerator;
}
