const defaultCancel = () => {
	console.log('当前任务已完成, 无效cancel');
};
const ctxReduce = (ctx, v, cb) => {
	v.forEach((i, index, source) => {
		ctx.then(() => cb(i, index, source, ctx));
	});
};

/**
 * 1. 函数或async函数
 * 2. 需要等待上一个执行完成，即所有注册均串行执行
 * 3. 每个函数可以中断，并清理支持清理（如果是定时器，异步相关可能存在回调，做取消）
 * 4. 两种异常处理，不再执行下一个函数（1. 抛出错误; 2. 同上中断函数，并清理）
 * 5. 支持数组reduce任务
 *
 * let serial = new Serial();
 * serial
 * 	.then(() => {})
 * 	.reduce([], () => {})
 * 	.then(() => {})
 * 	.reduce([], () => {})
 * 	.catch(() => {}) // 异常捕获，但不包括中断，中断是主动行为
 *
 * serial.cancel();
 *
 * TODO: 记录上一个值
 */
export default class Serial {
	static CANCEL_TAG = Symbol('@serial/cancel');

	constructor() {
		this.cancel = defaultCancel;

		this.cancelHooks = new Set();

		this.leafs = new Set();

		this.target = Promise.resolve();
	}

	then(original) {
		if (!original) return this;
		this.target = this.target.then(() => {
			return new Promise((resolve, reject) => {
				(async () => {
					let error;
					let isCancel = false;
					try {
						await Promise.race([
							new Promise((_, $reject) => {
								this.cancel = () => {
									Array.from(this.cancelHooks).forEach((fn) => fn());
									isCancel = true;
									$reject();

									// 子集
									Array.from(this.leafs).forEach((serial) => {
										serial.cancel();
										Array.from(serial.cancelHooks).forEach((fn) => fn());
									});
								};
							}),
							typeof original === 'function' ? original() : original,
						]);
					} catch (e) {
						error = e;
					} finally {
						this.cancelHooks.clear();
						this.leafs.clear();
						this.cancel = defaultCancel;

						if (!error && !isCancel) {
							resolve();
						} else if (error) {
							// 异常
							reject(error);
						} else {
							// 中断
							reject(Serial.CANCEL_TAG);
						}
					}
				})();
			});
		});

		return this;
	}

	reduce(value, cb) {
		if (typeof value === 'function') {
			this.then(() => {
				return new Promise((resolve, reject) => {
					let serial = new Serial();
					this.leafs.add(serial);

					ctxReduce(serial, value(), cb);
					serial.then(resolve).catch(reject);
				});
			});
		} else {
			ctxReduce(this, value, cb);
		}

		return this;
	}

	catch(onError) {
		this.target = this.target.catch((e) => {
			// 中断 不执行onError
			return e !== Serial.CANCEL_TAG && onError(e);
		});

		return this;
	}
}
