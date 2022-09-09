/**
 * 包文件量分析
 */
import visualizer from 'rollup-plugin-visualizer';

export default () => {
	return visualizer({
		filename: './dist/report.html',
		open: false,
		gzipSize: true,
		brotliSize: true,
	});
};
