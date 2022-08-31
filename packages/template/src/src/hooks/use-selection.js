import { ref } from 'vue';
import { Message } from '@wya/vc';

/**
 * 列表选择
 * @returns
 */
export const useSelection = (batchMessage = '请选择要操作的数据') => {
	const selection = ref([]);

	const setSelection = (value) => {
		selection.value = value;
	};

	/**
	 * 批量操作
	 * @param {*} fn
	 * @param {*} message 未选择数据时的提示
	 * @returns
	 */
	const batch = (fn, message) => {
		if (!selection.value.length) {
			Message.info(message);
			return;
		}
		return fn(selection.value);
	};

	const handleBatch = async (fn, ...rest) => {
		batch((_list) => fn(_list, ...rest), batchMessage);
	};

	return {
		selection,

		batch,
		setSelection,
		handleBatch,
	};
};
