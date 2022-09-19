<template>
	<vcc-set-title title="基础列表">
		<vcc-paging
			ref="pagingRef"
			:filter-options="filterOptions"
			:load-data="loadData"
			:history="true"
			:router="true"
			:footer="true"
		>
			<vc-table-column prop="" label="列名称" />
			<vcc-table-actions-column :data-source="getActions" @action="handleAction" />
		</vcc-paging>
	</vcc-set-title>
</template>

<script setup>
import './api';
import { Network } from '@/config';
import { usePaging } from '@/hooks';
import { useActions, useFilters } from './hooks';

const { pagingRef } = usePaging();
const { filterOptions, getFiltersParam } = useFilters();

const loadData = async (page, pageSize) => {
	try {
		const res = await Network.request({
			url: 'DEMO_PAGING_BASIC_GET',
			param: {
				page,
				pageSize,
				...getFiltersParam(),
			},
		});
		return res;
	} catch (e) {
		console.log(e);
	}
};

const { getActions, handleAction } = useActions();
</script>

<style lang="scss"></style>
