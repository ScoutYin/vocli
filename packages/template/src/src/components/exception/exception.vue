<template>
	<div class="v-exception g-flex-ac g-fd-c g-bg-white">
		<div class="g-fs-24 g-c-black g-bold">404</div>
		<div class="g-m-t-10 g-m-b-16 g-fs-14 g-c-999">抱歉，您访问的页面不存在</div>
		<vc-button type="primary" @click="handleGoHome">返回首页</vc-button>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const handleGoHome = () => {
	router.replace('/');
};
</script>

<style lang="scss">
.v-exception {
	height: 100vh;
	padding-top: 300px;
}
</style>
