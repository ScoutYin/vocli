<template>
	<vc-form
		ref="formRef"
		:model="formData"
		:rules="rules"
		:label-width="FORM_LABEL_WIDTH"
		class="g-m-t-20"
	>
		<vc-form-item label="零售价格：" prop="retail_price">
			<vc-input-number
				v-model="formData.retail_price"
				:max="999999.99"
				:min="0"
				:precision="2"
				output="string"
				placeholder="请输入零售价格"
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
	retail_price: [{ required: true, message: '请输入零售价格' }],
};

const validate = () => {
	return formRef.value.validate();
};

defineExpose({
	validate,
});
</script>

<style lang="scss"></style>
