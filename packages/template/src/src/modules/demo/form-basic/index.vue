<template>
	<vcc-set-title title="基础表单">
		<vcc-section-title>基本信息</vcc-section-title>
		<gx-base ref="baseRef" :info="formData" />

		<vcc-footer cancel-text="" ok-text="保存" @ok="handleSave" />
	</vcc-set-title>
</template>

<script setup>
import './api';
import { onMounted, ref, reactive } from 'vue';
import { Network } from '@/config';
import { GxBase } from './sections';

const baseRef = ref();
const formData = reactive({
	store_name: '',
	store_image: '',
});

const loadData = async () => {
	const { data } = await Network.request({
		url: 'DEMO_PAGING_FORM_BASIC_GET',
	});

	Object.assign(formData, data);
};

const getDataForSave = () => {
	return { ...formData };
};

const handleSave = async () => {
	await baseRef.value.validate();
	await Network.request({
		type: 'POST',
		url: 'DEMO_PAGING_FORM_BASIC_POST',
		param: getDataForSave(),
	});
};

onMounted(() => {
	loadData();
});
</script>
