<template>
	<vcc-set-title title="带tabs的列表">
		<vcc-paging-group
			ref="pagingGroup"
			:history="true"
			:router="true"
			:footer="true"
			:filter-options="filterOptions"
			:load-data="loadData"
		>
			<vc-tabs :model-value="type" type="card" @click="handleChange">
				<vc-tabs-pane v-for="item in tabs" :key="item.value" :label="item.label" :name="item.value">
					<vcc-paging
						v-model:current="currentPages[item.value]"
						:disabled="item.value != type"
						:table-options="tableOptions"
						style="width: 100%"
						selectable
						@selection-change="handleSelectionChange"
					>
						<vc-table-column prop="" label="列名称" />
						<vcc-table-actions-column :data-source="getActions" @action="handleAction" />

						<template #extra>
							<vc-button @click="handleBatch(deleteItems)">删除</vc-button>
						</template>
					</vcc-paging>
				</vc-tabs-pane>
			</vc-tabs>
		</vcc-paging-group>
	</vcc-set-title>
</template>

<script setup>
import './api';
import { ref } from 'vue';
import { Network } from '@/config';
import { useTabsPaging, useSelection } from '@/hooks';
import { useFilters, useActions } from './hooks';

const tableOptions = {
	rowKey: 'xx_id',
};

const { type, currentPages, pagingGroup, refresh, setType: handleChange } = useTabsPaging();

const { filterOptions, getFiltersParam } = useFilters();

const tabs = ref([
	{ label: '全部', value: '0' },
	{ label: '已上架', value: '1' },
	{ label: '已下架', value: '2' },
]);

const loadData = async (page, pageSize) => {
	try {
		const res = await Network.request({
			url: 'DEMO_PAGING_TABS_GET',
			param: {
				page,
				pageSize,
				...getFiltersParam(),
			},
			localData: {
				status: 1,
				data: {
					list: [{}, {}],
					page: {
						current: 1,
						count: 2,
						total: 1,
					},
				},
			},
		});

		return res;
	} catch (e) {
		console.log(e);
	}
};

const { getActions, handleAction, deleteItems } = useActions(refresh);

const { handleBatch, setSelection: handleSelectionChange } = useSelection();
</script>

<style lang="scss"></style>
