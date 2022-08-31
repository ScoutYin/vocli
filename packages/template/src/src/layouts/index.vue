<template>
	<section class="c-layout g-flex">
		<router-view name="sideMenu" />
		<div class="c-layout__main g-flex g-fd-c g-col">
			<router-view name="topMenu" />
			<router-view name="breadcrumb" />
			<main :class="!$route.meta.noWrapStyle ? 'is-wrap' : ''" class="c-layout__content g-col">
				<router-view />
			</main>
		</div>
	</section>
</template>

<script setup>
import { VcInstance } from '@wya/vc';
import { Service } from '@wya/vcc';
import { onBeforeRouteUpdate } from 'vue-router';

onBeforeRouteUpdate(() => {
	VcInstance.clear();
	Service.clear();
});
</script>

<style lang="scss">
.c-layout {
	height: 100vh;
	overflow: hidden;

	&__main {
		overflow: hidden;
	}

	&__content {
		overflow: auto;

		&.is-wrap {
			padding: 20px;
			margin: 10px;
			background: #fff;
		}
	}
}
</style>
