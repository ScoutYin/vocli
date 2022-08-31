<template>
	<vc-form
		ref="formRef"
		:model="formData"
		:rules="rules"
		:label-width="LABEL_WIDTH"
		class="g-m-t-21 g-pd-tb-10 g-pd-lr-24"
		position="left"
	>
		<vc-form-item label="门店名称：" prop="store_name">
			<vc-input
				v-model="formData.store_name"
				:maxlength="30"
				placeholder="请输入"
				style="width: 300px"
			/>
		</vc-form-item>
		<vc-form-item label="门店图片：" prop="store_image">
			<vc-upload-picker
				:model-value="formData.store_image ? [formData.store_image] : []"
				:max="1"
				class="g-m-t-26"
				@change="handleImageChange"
			/>
		</vc-form-item>
	</vc-form>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useSyncData } from '@/hooks';
import { LABEL_WIDTH } from '../constants';

defineProps({
	info: {
		type: Object,
		default: () => ({}),
	},
});

const formRef = ref();
const [formData] = useSyncData();

const rules = reactive({
	store_name: [
		{
			required: true,
			message: '门店名称必填',
		},
	],
	store_image: [
		{
			required: true,
			message: '门店品牌必填',
		},
	],
});

const handleImageChange = (v) => {
	formData.value.store_image = v[0];
};

const validate = () => {
	return formRef.value.validate();
};

defineExpose({
	validate,
});
</script>

<style lang="scss"></style>
