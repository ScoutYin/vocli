<template>
	<vcc-set-title title="带操作步骤的表单" style="padding-bottom: 70px">
		<vc-steps-bar v-model="step" :data-source="steps" class="g-m-b-24" readonly />

		<template v-if="step === 1">
			<vcc-section-title>步骤一设置</vcc-section-title>
			<gx-step1 ref="step1Ref" :info="formData" />
		</template>

		<template v-else-if="step === 2">
			<vcc-section-title>步骤二设置</vcc-section-title>
			<gx-step2 ref="step2Ref" :info="formData" />
		</template>
		<template v-else-if="step === 3">
			<vcc-section-title>步骤三设置</vcc-section-title>
			<gx-step3 ref="step3Ref" :info="formData" />
		</template>

		<vcc-footer
			:ok-text="okText"
			:cancel-text="cancelText"
			@cancel="handleCancel"
			@ok="handleSave"
		/>
	</vcc-set-title>
</template>

<script setup>
import './api';
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { cloneDeep } from 'lodash';
import { Network } from '@/config';
import { useSessionData } from '@/hooks';
import GxStep1 from './components/step1.vue';
import GxStep2 from './components/step2.vue';
import GxStep3 from './components/step3.vue';

const route = useRoute();
const router = useRouter();

const editorId = route.params.id;
const isEdit = !!editorId;

const step1Ref = ref();
const step2Ref = ref();
const step3Ref = ref();

const step = ref(1);
const steps = ref([
	{ label: '步骤一', value: 1 },
	{ label: '步骤二', value: 2 },
	{ label: '步骤三', value: 3 },
]);

const okText = computed(() => {
	return step.value === steps.value.length ? '保存' : '下一步';
});

const cancelText = computed(() => {
	return step.value === 1 ? '取消' : '上一步';
});

const [formData] = useSessionData({
	product_name: '',
	retail_price: '',
	product_status: 1,
});

const loadData = async () => {
	const { data } = await Network.request({
		url: 'DEMO_PAGING_FORM_STEPS_GET',
		param: {
			product_id: editorId,
		},
	});
	Object.assign(formData, data);
};

const getDataForSave = () => {
	const data = cloneDeep(formData);

	// 此处可对数据进行相应处理...

	return data;
};

const handleSave = async () => {
	if (step.value === 1) {
		await step1Ref.value.validate();
	} else if (step.value === 2) {
		await step2Ref.value.validate();
	}

	if (step.value < steps.value.length) {
		step.value++;
		return;
	}

	await Network.request({
		url: 'DEMO_PAGING_FORM_STEPS_POST',
		type: 'POST',
		param: getDataForSave(),
	});
	router.back();
};

const handleCancel = () => {
	step.value <= 1 ? router.back() : step.value--;
};

onMounted(() => {
	isEdit && loadData();
});
</script>

<style lang="scss"></style>
