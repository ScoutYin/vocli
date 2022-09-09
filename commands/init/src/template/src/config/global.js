import { Storage, Cookie } from '@wya/utils';
import { EventStore } from '@wya/ps';
import { TOKEN_TAG, BRANCH_TAG } from '../constants';
import { Network } from './network';
import { resetRouter, addDynamicRoutes } from '@/router';

class GlobalManager extends EventStore {
	constructor() {
		super();
		// 版本号
		this.version = '1.0';
		this.branch = process.env.BRANCH || 'master';
		this.forceBranch = this.branch;
		this.app = null;
		this.router = null;

		this.user = {};

		this.initial();
	}

	/**
	 * 初始化数据
	 * 1. 缓存版本号
	 * 2. 当前客服端想使用的哪个分支做测试
	 */
	initial() {
		Storage.setVersion(this.version);
		Cookie.setVersion(this.version);

		this.forceBranch = (this.branch === 'develop' && Storage.get(BRANCH_TAG)) || this.branch;
		Network.setGlobal(this);

		this.user = Storage.get(TOKEN_TAG) || {};
	}

	/**
	 * power为权限字段
	 */
	hasAuth(auth) {
		if (process.env.NODE_ENV === 'development') return true; // TODO: 添加权限
		if (!this.user || !this.user.power) return false;

		return (Array.isArray(auth) ? auth : [auth]).some((it) => {
			if (typeof it === 'boolean') {
				return it;
			}
			if (typeof it === 'number' || typeof it === 'string') {
				return this.user.power[it];
			}
			if (typeof it === 'function') {
				return it(this);
			}
			if (typeof it === 'undefined') {
				return true;
			}
			return false;
		});
	}

	/**
	 * 判断是否已经登录
	 *
	 * @returns {boolean} ~
	 */
	isLoggedIn() {
		const user = Storage.get(TOKEN_TAG);
		return !!user;
	}

	/**
	 * 清理登录
	 */
	async clearLoginAuth() {
		this.user = {};
		Storage.remove(TOKEN_TAG);
		window.dispatchEvent(new Event('@wya/logout'));
		resetRouter();
		this.router.replace('/login');
	}

	async createLoginAuth(config) {
		this.user = config;

		Storage.set(TOKEN_TAG, config);
		window.dispatchEvent(new Event('@wya/login'));

		addDynamicRoutes();

		if (this.router) {
			this.router.replace('/');
		}
	}

	updateUser(config) {
		this.user = Object.assign(this.user, config);
		Storage.set(TOKEN_TAG, this.user);
	}

	// Vue 注册用
	install(app, options) {
		const { Router } = options;
		app.config.globalProperties.$request = Network.request;
		app.config.globalProperties.$global = this;

		this.router = Router;
		this.app = app;
	}
}

export const Global = new GlobalManager();
