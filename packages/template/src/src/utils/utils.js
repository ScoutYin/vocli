// -- 微一案工具库 --
export * from '@wya/utils';

import { Utils, RegEx } from '@wya/utils';

// -- end --
/**
 * 改写@wya/utils里表单验证的正则
 */
RegEx.set({
	URLScheme: {
		value: /[a-zA-z]+:\/\/[^\s]*/,
		msg: '请填写正确网页地址协议',
	},
	letterAndNumber: {
		value: /^[A-Za-z0-9]{1,}$/,
		msg: '请不要输入特殊字符',
	},
	phone: {
		value: /^0[1-9][0-9]{1,2}-[2-8][0-9]{6,7}$/,
		msg: '请填写正确的电话号码',
	},
});

// -- 业务相关 --
export const initTreeData = (obj, value, label, children) => {
	if (typeof obj === 'object') {
		return JSON.parse(
			JSON.stringify(obj)
				.replace(new RegExp(value, 'g'), 'value')
				.replace(new RegExp(label, 'g'), 'label')
				.replace(new RegExp(`children|${children}`, 'g'), 'children')
		);
	}
	console.error('参数错误');
	return [];
};

/**
 * 作为分页初始数据
 * for mobile
 */
export const initScroll = {
	// current: 0,
	total: 0,
	count: 0,
	data: [],
};
/**
 * 作为分页初始数据
 * for pc
 */
export const initPage = {
	reset: false,
	current: 0,
	total: 0,
	count: 0,
	data: {},
};

export const createSession = () => {
	throw new Error('移步使用useSessionData');
};

// 方便调用
Utils.set({
	createSession,
	initScroll,
	initPage,
	initTreeData,
});
