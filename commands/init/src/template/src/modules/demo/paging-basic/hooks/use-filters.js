import { reactive } from 'vue';
import { useRoute } from 'vue-router';

export const useFilters = () => {
	const route = useRoute();

	const filterOptions = reactive({
		modules: [
			{
				type: 'input',
				field: 'input',
				label: '关键词：',
				options: {
					placeholder: '请输入关键词搜索',
				},
			},
			{
				type: 'input',
				field: 'input2',
				label: '关键词：',
				options: {
					placeholder: '请输入关键词搜索',
				},
			},
		],
	});

	const getFiltersParam = () => {
		const param = {
			...route.query,
		};

		return param;
	};

	return {
		filterOptions,
		getFiltersParam,
	};
};
