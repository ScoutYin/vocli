import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';

/**
 * 带tabs的列表中tabs相关逻辑
 * @returns
 */
export const useTabsPaging = (options) => {
	// 默认 type
	let defaultType = '0';
	// type 对应接口使用的字段名，如 status，xxx_status 等
	let typeFieldName = 'type';

	if (typeof options === 'string' || typeof options === 'number') {
		defaultType = options;
	} else if (options) {
		defaultType = options.defaultType || defaultType;
		typeFieldName = options.typeFieldName || typeFieldName;
	}

	const route = useRoute();
	const router = useRouter();

	const currentPages = reactive({});
	const pagingGroup = ref(null);

	const type = ref(String(route?.query?.[typeFieldName] || defaultType));

	const setType = async (v) => {
		await router.replace({
			path: route.path,
			query: {
				...route.query,
				[typeFieldName]: v,
				page: currentPages[v] || 1,
			},
		});

		type.value = v;
	};

	const refresh = (...rest) => {
		pagingGroup.value.reset(...rest);
	};

	return {
		route,
		router,
		// 前端业务内保持统一，还是使用 type
		type,
		currentPages,
		pagingGroup,

		setType,
		refresh,
	};
};
