<template>
	<vcm-form
		ref="form"
		:model="formValidate"
		:label-width="96"
		style="width: 100vw; height: 100vh"
		label-position="left"
		class="g-fd-c g-bg-white"
		@submit.prevent
	>
		<!-- flex下vcm-form-item 要使用flex: 1 -->
		<vcm-form-item label="adminID" prop="admin_id" required>
			<vcm-input v-model="formValidate.admin_id" placeholder="请输入Code" />
		</vcm-form-item>

		<vcm-form-item label="Token：" prop="token">
			<vcm-input v-model="formValidate.token" placeholder="请输入Token" />
		</vcm-form-item>

		<vcm-form-item>
			<vcm-button class="g-m-t-24" type="primary" @click="handleLogin"> 登录 </vcm-button>
		</vcm-form-item>
	</vcm-form>
</template>

<script>
import { reactive, ref } from 'vue';
import { Message } from '@wya/vc';
import { ajax } from '@wya/http';
import { URL } from '@wya/utils';
import { Global } from '@/config';
import './api';

export default {
	setup() {
		const form = ref(null);
		const formValidate = reactive({
			token: URL.get('token') || 'a829332c01793549ad507c454c71900b',
			admin_id: URL.get('admin_id') || '111832',
		});

		const handleLogin = async () => {
			try {
				await form.value.validate();
				/**
				 * 伪登录，很重要
				 */
				let res = await ajax({
					url: '',
					type: 'GET',
					param: {
						admin_id: formValidate.admin_id || '',
						system: 'pa',
					},
					headers: {
						token: formValidate.token,
					},

					localData: {
						status: 1,
						data: {},
					},
				});

				Global.createLoginAuth({
					admin_id: formValidate.admin_id,
					token: formValidate.token,
					...res.data,
					__USER_CONFIG__: true,
				});
			} catch (e) {
				e.status && Message.info(e.msg);
				console.log(e);
			}
		};

		return {
			form,
			formValidate,
			handleLogin,
		};
	},
};
</script>

<style lang="scss"></style>
