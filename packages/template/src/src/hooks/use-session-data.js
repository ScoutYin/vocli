import { onMounted, reactive, onBeforeUnmount, isReactive, isRef } from 'vue';
import { Utils, Storage, URL } from '@wya/utils';

const createSession = (key) => {
	let session = key || Utils.getUid();

	if (session !== key) {
		let { path, query } = URL.parse();

		let config = URL.merge({
			path,
			query: {
				...query,
				session,
			},
		});
		typeof window !== 'undefined' && window.history.replaceState(null, '', config);
	}

	return session;
};
/**
 * 如 const [formData, syncData] = useSessionData({ ...any })
 */
export const useSessionData = (originalData, onBefore) => {
	const formData = isReactive(originalData)
		? originalData
		: reactive(isRef(originalData) ? originalData.value : originalData);

	let uuid;
	const syncData = async () => {
		let data = {};
		if (onBefore) {
			data = await onBefore();
		}

		Object.assign(formData, data);
		Storage.set(uuid, formData, { session: true });
	};

	let timer;
	onMounted(() => {
		uuid = createSession(URL.get('session'));
		const sessionData = Storage.get(uuid, { session: true });

		sessionData && Object.keys(sessionData).length > 0 && Object.assign(formData, sessionData);

		// 每5秒同步一次数据
		timer = setInterval(syncData, 5000);
	});

	onBeforeUnmount(() => clearInterval(timer));

	return [formData, syncData];
};
