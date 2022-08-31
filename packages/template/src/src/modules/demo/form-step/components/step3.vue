<template>
	<vc-form
		ref="formRef"
		:model="formData"
		:rules="rules"
		:label-width="FORM_LABEL_WIDTH"
		class="g-m-t-20"
	>
		<vc-form-item label="是否上架：" required>
			<vc-radio-group v-model="formData.product_status">
				<vc-radio :label="1"> 是 </vc-radio>
				<vc-radio :label="2"> 否 </vc-radio>
			</vc-radio-group>
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

const rules = {};

const validate = () => {
	return formRef.value.validate();
};

defineExpose({
	validate,
});
</script>

<style lang="scss"></style>
