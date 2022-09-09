const fs = require('fs-extra');
const chalk = require('chalk');
const parseArgs = require('minimist');

const commitRE =
	/^(revert: )?(fix|feat|docs|perf|style|test|types|build|chore|refactor|breaking change)(\(.+\))?: .{1,50}/;
const mergeRE = /Merge branch /;

const { msgPath } = parseArgs(process.argv.slice(2));

const commitMsg = fs.readFileSync(msgPath, 'utf-8').trim();

if (!commitRE.test(commitMsg) && !mergeRE.test(commitMsg)) {
	console.log();
	console.error(
		chalk.bgRed.white(' ERROR ') +
			chalk.red(` invalid commit message: "${commitMsg}".\n\n`) +
			chalk.red('Examples:\n\n') +
			chalk.green(`  - fix(Button): incorrect style\n`) +
			chalk.green(`  - feat(Button): incorrect style\n`) +
			chalk.green(`  - docs(Button): fix typo\n\n`) +
			chalk.red(`Allowed Types:\n\n`) +
			chalk.green(`  - fix：修复bug\n`) +
			chalk.green(`  - feat：新功能（feature）\n`) +
			chalk.green(`  - docs：文档（documentation）\n`) +
			chalk.green(`  - test：添加或修改测试代码\n`) +
			chalk.green(
				`  - chore：杂项，其他不需要修改源代码或不需要修改测试代码的修改，构建过程或辅助工具的变动\n`
			) +
			chalk.green(`  - refactor：重构（即不是新增功能，也不是修复bug的代码变动）\n`) +
			chalk.green(
				`  - style 不影响代码含义的改动，例如去掉空格、改变缩进、增删分号等代码样式改动\n`
			) +
			chalk.green(`  - perf 优化相关，比如提升性能、体验\n`) +
			chalk.green(`  - types 类型代码修改，不影响运行时代码逻辑\n`) +
			chalk.green(`  - build 构建工具或者外部依赖包的修改，比如更新依赖包的版本\n`) +
			chalk.green(`  - breaking change\n`) +
			chalk.green(`  - Merge branch 'foo' into 'bar' 分支合并\n\n`)
	);
	process.exit(1);
}
