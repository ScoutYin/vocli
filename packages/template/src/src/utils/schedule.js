/**
 * 生成一个调度
 * 1. 可以一直等待，知道完成为止
 * 2. 超时强制返回resolve, 可以考虑reject
 * 3. 携带参数
 * 4. 携带参数
 */
export default class Schedule {
	constructor(name, timeout) {
		this.complete = () => {};
		this.fail = () => {};
		this.target = Promise.resolve();

		this.timeout = timeout || 0;

		this.timer = null;

		this.name = name;

		this.extra = null;

		this.isComplete = true;
	}

	/**
	 * 生成下一个调度
	 *
	 * @param {object} options ~
	 * @returns {Schedule} ~
	 */
	next(options) {
		const { timeout, extra } = options || {};
		this.extra = extra || null;

		this.isComplete = false;
		this.target = new Promise((resolve, reject) => {
			this.complete = (data) => {
				console.log(`%c [Schedule#${this.name}]`, 'color: red; font-weight: bold', 'complete');
				this.isComplete = true;
				resolve(data);
			};

			this.fail = (error) => {
				reject(error);
			};

			if ((timeout && timeout > 0) || this.timeout > 0) {
				this.timer = setTimeout(() => resolve(), (timeout || this.timeout) * 1000);
			}
		});

		return this;
	}
}
