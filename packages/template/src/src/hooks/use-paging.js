import { ref } from 'vue';

export const usePaging = () => {
	const pagingRef = ref(null);

	const refresh = (page) => {
		pagingRef.value.reset(page);
	};

	return {
		pagingRef,

		refresh,
	};
};
