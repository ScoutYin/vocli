<template>
	<vc-form
		ref="formRef"
		:model="formData"
		:rules="rules"
		:label-width="FORM_LABEL_WIDTH"
		class="g-m-t-20"
	>
		<vc-form-item label="商品名称：" prop="product_name">
			<vc-input
				v-model="formData.product_name"
				:maxlength="50"
				placeholder="请输入商品名称"
				:indicator="{ inline: true, inverted: false }"
				style="width: 300px"
			/>
		</vc-form-item>
	</vc-form>
</template>

<script setup>
import { ref } from 'vue';
import { useSyncData } from '@/hooks';
import { FORM_LABEL_WIDTH } from '../constants';

defineProps({ info: Object });

const [formData] = useSyncData();

const formRef = ref();

const rules = {
	product_name: [{ required: true, message: '请输入商品名称' }],
};

const validate = () => {
	return formRef.value.validate();
};

defineExpose({
	validate,
});
</script>

<style lang="scss"></style>
