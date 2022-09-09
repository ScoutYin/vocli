import * as WYA_VC from '@wya/vc';
import * as WYA_VCC from '@wya/vcc';
import { Global } from './global';
import { getVcConfig } from './vc';
import { getVccConfig } from './vcc';

export * from './global';
export * from './network';
export * from './vc';
export * from './vcc';

export const setupConfig = (app, options) => {
	// 全局信息
	app.use(Global, options);
	// VC配置
	app.use(WYA_VC, getVcConfig(options));
	// VCC配置
	app.use(WYA_VCC, getVccConfig(options));
};
