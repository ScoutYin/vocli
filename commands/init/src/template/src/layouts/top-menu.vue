<template>
	<div class="v-layout-top">
		<div class="g-flex-ac g-jc-sb">
			<div v-if="topMenus.length === 1" class="c-layout-top__menu-item is-single">
				{{ topMenus[0].meta.title }}
			</div>
			<div v-else class="g-flex-ac g-fw-w">
				<router-link
					v-for="menu in topMenus"
					:key="menu.path"
					:to="menu.path"
					:class="{ 'is-active': activeChain[2].path === menu.path }"
					class="c-layout-top__menu-item"
				>
					{{ menu.meta.title }}
				</router-link>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { useMenus } from './hooks';

const { activeChain } = useMenus();

const topMenus = computed(() => {
	return activeChain.value[1]?.children || [activeChain.value[activeChain.value.length - 1]];
});
</script>

<style lang="scss">
.v-layout-top {
	height: 56px;
	padding: 0 15px;
	background-color: var(--white);
	border-bottom: 1px solid var(--cd9);

	.c-layout-top__menu-item {
		height: 56px;
		padding: 0 10px;
		font-size: 14px;
		line-height: 56px;
		color: var(--black);
	}

	.c-layout-top__menu-item:not(.is-single) {
		margin-right: 20px;
		cursor: pointer;
		opacity: 0.8;

		&:not(:first-child) {
			margin: 0 20px;
		}

		&:hover {
			opacity: 1;
			transition: opacity 0.2s ease-in-out;
			will-change: opacity;
		}

		&.is-active {
			color: var(--main);
			border-bottom: 2px solid var(--main);
			box-sizing: border-box;
		}
	}
}
</style>
