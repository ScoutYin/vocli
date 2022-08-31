import { EventStore } from '@wya/ps';

const isGenerator = (func) => {
	return typeof func.constructor === 'function' && func.constructor.name === 'GeneratorFunction';
};

const functionToIterator = (func) => {
	return {
		next: () => {
			let promise = func();
			return promise && promise.then ? { value: promise } : { done: true };
		},
	};
};

const promiseToIterator = (promise) => {
	let called = false;
	return {
		next: () => {
			if (called) {
				return { done: true };
			}
			called = true;
			return { value: promise };
		},
	};
};

const toIterator = (obj, promise) => {
	let type = typeof obj;
	if (type === 'object') {
		if (typeof obj.next === 'function') {
			return obj;
		}
		/* istanbul ignore else */
		if (typeof obj.then === 'function') {
			return promiseToIterator(obj);
		}
	}
	if (type === 'function') {
		return isGenerator(obj) ? obj() : functionToIterator(obj);
	}

	return promiseToIterator(promise.resolve(obj));
};

/**
 * 用于并发的Promise, 如同时只能存在6个Promise正在处理
 * 拷贝于营流宝游戏项目
 */
class Pool extends EventStore {
	constructor(source, concurrency, options) {
		super();
		this._concurrency = concurrency;
		this._options = options || {};
		this._options.promise = this._options.promise || Promise;
		this._iterator = toIterator(source, this._options.promise);
		this._done = false;
		this._size = 0;
		this._promise = null;
		this._callbacks = null;
	}

	concurrency(value) {
		if (typeof value !== 'undefined') {
			this._concurrency = value;
			if (this.active()) {
				this._proceed();
			}
		}
		return this._concurrency;
	}

	size() {
		return this._size;
	}

	active() {
		return !!this._promise;
	}

	promise() {
		return this._promise;
	}

	start() {
		let Promise = this._options.promise;
		this._promise = new Promise((resolve, reject) => {
			this._callbacks = {
				reject,
				resolve,
			};
			this._proceed();
		});
		return this._promise;
	}

	stop() {
		this._callbacks && this._callbacks.resolve();
		this._promise = null;
		this._callbacks = null;
		this._size = 0;

		this.off('fulfilled');
		this.off('rejected');
	}

	_settle(error) {
		if (error) {
			this._callbacks.reject(error);
		} else {
			this._callbacks.resolve();
		}
		this._promise = null;
		this._callbacks = null;
		this._size = 0;
	}

	_proceed() {
		if (!this._done) {
			let result = { done: false };
			while (
				this._size < this._concurrency &&
				!(result = this._iterator.next()).done // eslint-disable-line
			) {
				this._size++;
				this._trackPromise(result.value);
			}
			this._done = result === null || !!result.done;
		}
		if (this._done && this._size === 0) {
			this._settle();
		}
	}

	_trackPromise(promise) {
		promise
			.then((result) => {
				this._onPooledPromiseFulfilled(promise, result);
			})
			.catch((error) => {
				this._onPooledPromiseRejected(promise, error);
			})
			.catch((error) => {
				this._settle(new Error('Promise processing failed: ' + error));
			});
	}

	_onPooledPromiseFulfilled(promise, result) {
		this._size && this._size--;
		if (this.active()) {
			this.emit('fulfilled', {
				promise,
				result,
			});
			this._proceed();
		}
	}

	_onPooledPromiseRejected(promise, error) {
		this._size && this._size--;
		if (this.active()) {
			this.emit('rejected', {
				promise,
				error,
			});

			// 允许继续执行, 这个时候要调用stop来停止程序
			if (this._options.infinite) {
				this._proceed();
			} else {
				this._settle(error || new Error('Unknown error'));
			}
		}
	}
}

export default Pool;
