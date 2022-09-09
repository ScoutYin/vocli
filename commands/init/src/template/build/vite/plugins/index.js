import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import visualizer from './visualizer';
import { isBuild } from '../../utils';

export const createPlugins = (options) => {
	const COMMAND_IS_BUILD = isBuild(options.command);

	const plugins = [vue(), vueJsx()];

	if (COMMAND_IS_BUILD) {
		plugins.push(
			// 包文件量分析
			visualizer()
		);
	}
	return plugins;
};
