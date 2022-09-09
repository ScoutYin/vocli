import { EventStore } from '@wya/ps';

/**
 * 强化日志输出
 * 1. 实例化的情况下，能统一管理日志
 * 2. 静态方法直接打印日志
 */
export default class Logger extends EventStore {
	static debug(...rest) {
		console.log(`%c [dy-sprite]`, 'color: red; font-weight: bold', ...rest);
	}

	// eslint-disable-next-line no-useless-constructor
	constructor() {
		super();
		// TODO
	}

	log(...rest) {
		Logger.debug(...rest);

		this.emit('debug', {
			message: rest
				.map((i) => {
					if (typeof i === 'string') {
						return i;
					}

					try {
						return JSON.stringify(i) || '';
					} catch {
						return i || '';
					}
				})
				.join(''),
		});
	}

	debug(...rest) {
		Logger.debug(...rest);
	}
}
