export const useActions = (refresh) => {
	const getActions = (row) => {
		return [{ label: '编辑' }, { label: '删除', show: row.status === 0 }];
	};

	const deleteItems = (row) => {
		console.log(`TODO: 删除数据 ${row}`);
	};

	const handleAction = async (label, row) => {
		switch (label) {
			case '编辑':
				console.log(row);
				// TODO
				break;

			case '删除':
				// TODO
				refresh();
				break;

			default:
				break;
		}
	};

	return {
		getActions,
		handleAction,
		deleteItems,
	};
};
