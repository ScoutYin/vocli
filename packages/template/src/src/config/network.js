import createHttpClient from '@wya/http';
import { Message } from '@wya/vc';
import { RegEx, Storage } from '@wya/utils';
import { API, TOKEN_TAG } from '../constants';
import { Schedule } from '../utils';

class NetworkManager {
	constructor() {
		this.baseUrl = new Schedule('network');
		this.baseUrl.next();

		this.request = this.genRequest()['ajax'];
	}

	setGlobal(ctx) {
		this.global = ctx;
		this.baseUrl.complete(
			ctx.forceBranch === 'develop'
				? 'https://gateway-mobile.wyawds.com'
				: ctx.forceBranch === 'pre-release'
				? 'https://gateway-mobile.wyawds.com'
				: 'https://gateway-mobile.wyawds.com'
		);
	}

	genRequest() {
		let msgInstance = null;

		const loadingFn = ({ options }) => {
			const { tipMsg } = options || {};
			msgInstance && Message.destroy(msgInstance);
			msgInstance = Message.loading(tipMsg || '加载中...', 0);
		};
		const loadedFn = () => {
			msgInstance && Message.destroy(msgInstance);
		};

		const otherFn = ({ response }) => {
			switch (response.status) {
				case -1:
					loadedFn();
					this.global.clearLoginAuth();
					break;
				default:
					break;
			}
		};

		const beforeFn = ({ options }) => {
			return {
				...options,
				headers: {
					token: (Storage.get(TOKEN_TAG) || {}).token,

					// token也可以被覆盖
					...options.headers,
				},
			};
		};
		const afterFn = ({ options, response }) => {
			let {
				successTip = true,
				errorTip = true,
				errorMsg = response.msg,
				successMsg = response.msg,
				method,
			} = options;

			successTip = successTip && method !== 'GET';
			errorTip = errorTip && !response.code;

			// 可以是promise，不要随便写return
			switch (response.status) {
				case 0:
					errorTip && errorMsg && Message.error(errorMsg);
					break;
				case 1:
					successTip && successMsg && Message.success(successMsg);
					break;
				default:
					break;
			}
		};

		const globalOptions = {
			onLoading: loadingFn,
			onLoaded: loadedFn,
			onOther: otherFn,
			onBefore: beforeFn,
			onAfter: afterFn,
			apis: this,
			debug: process.env.NODE_ENV !== 'production',
			// requestType: 'form-data:json'
		};

		return createHttpClient(globalOptions);
	}

	inject(target) {
		this.baseUrl.target.then((base) => {
			for (let i in target) {
				if (process.env.NODE_ENV === 'development') {
					this[i] && console.warn(`[@stores/apis]: key重复注入 ${i}`);
				}

				this[i] = RegEx.URLScheme.test(target[i]) ? target[i] : base + target[i];
			}
		});
		return this;
	}
}

export const Network = new NetworkManager().inject(API);
