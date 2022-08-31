<template>
	<aside class="c-layout-side-menu g-flex">
		<div class="c-layout-side-menu__first-level">
			<div style="height: 56px" class="g-flex-cc g-m-t-10">
				<vc-popover
					trigger="click"
					placement="bottom-right"
					:arrow="false"
					portal-class-name="c-layout-side-menu__dropdown"
				>
					<img :src="LOGO" class="c-layout-side-menu__logo g-pointer" />
					<template #content>
						<div
							class="c-layout-side-menu__dropdown-action g-pointer g-flex-cc"
							@click="handleEditPwd"
						>
							修改密码
						</div>
						<div
							class="c-layout-side-menu__dropdown-action g-pointer g-flex-cc"
							@click="handleLogOut"
						>
							退出登录
						</div>
					</template>
				</vc-popover>
			</div>
			<router-link
				v-for="chunk in visibleMenus"
				:key="chunk.path"
				:to="chunk.path"
				:class="{ 'is-active': activeChain[0].path === chunk.path }"
				class="c-layout-side-menu__item"
			>
				<div class="c-layout-side-menu__item-icon">
					<vc-icon :type="chunk.meta.icon" :inherit="chunk.inherit" class="g-m-r-5" />
					<span>{{ chunk.meta.title }}</span>
				</div>
			</router-link>
		</div>

		<div v-if="showChildMenus" class="c-layout-side-menu__two-level g-bg-white">
			<div class="c-layout-side-menu__chunk-name">
				{{ realOneLevelChunk.meta.title }}
			</div>
			<div class="g-pd-12">
				<router-link
					v-for="menu in visibleChildMenus"
					:key="menu.path"
					:to="menu.path"
					:class="{ 'is-active': activeChain[1].path === menu.path }"
					class="c-layout-side-menu__item g-relative"
				>
					{{ menu.meta.title }}
				</router-link>
			</div>
		</div>
	</aside>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Modal } from '@wya/vc';
import LOGO from '@/assets/images/logo.png';
import { Global, Network } from '@/config';
import { useMenus } from './hooks';

const route = useRoute();

const { visibleMenus, activeChain, visibleChildMenus, realOneLevelChunk } = useMenus();

// 是否展示二级导航菜单
const showChildMenus = computed(() => {
	// 当前路由没有要求隐藏二级导航菜单，且存在有效的二级导航菜单
	return !route.meta.hiddenMenus?.includes(2) && visibleChildMenus.value.length;
});

// methods
const handleLogOut = () => {
	Modal.info({
		title: '提示',
		content: '确定退出登录？',
		onOk: async () => {
			await Network.request({
				url: '_COMMON_LOGIN_OUT_POST',
				localData: {
					status: 1,
					data: {},
				},
			});
			Global.clearLoginAuth();
		},
	});
};
const handleEditPwd = async () => {
	console.log('TODO: 修改密码');
};
</script>

<style lang="scss">
.c-layout-side-menu {
	user-select: none;

	&__logo {
		width: 40px;
		height: 40px;
	}

	&__item {
		display: block;
		cursor: pointer;
	}

	&__first-level {
		width: 120px;
		height: 100%;
		background-color: var(--c444);

		.c-layout-side-menu__item {
			height: 42px;
			padding-left: 23px;
			font-size: 15px;
			line-height: 42px;
			color: var(--cbd);

			&:hover {
				background-color: var(--c67);
				transition: background-color 0.2s linear;
			}

			&.is-active {
				color: var(--black);
				background-color: var(--cf8);
			}

			.c-layout-side-menu__item-icon {
				display: flex;
				align-items: center;
			}
		}
	}

	&__two-level {
		width: 130px;

		.c-layout-side-menu__chunk-name {
			height: 56px;
			font-size: 14px;
			line-height: 56px;
			color: var(--black);
			text-align: center;
			border-right: 1px solid var(--cd9);
			border-bottom: 1px solid var(--cd9);
		}

		.c-layout-side-menu__item {
			height: 32px;
			margin-bottom: 5px;
			font-size: 14px;
			line-height: 32px;
			color: #676767;
			text-align: center;

			&:hover {
				color: var(--main);
				transition: color 0.2s linear;
			}

			&.is-active {
				color: var(--black);
				background: var(--cef);
				border-radius: 4px;
			}
		}

		.__notice-dot {
			position: absolute;
			top: 50%;
			right: -5px;
			height: 20px;
			min-width: 20px;
			padding: 0 6px;
			font-size: 12px;
			color: #fff;
			background-color: #f8222d;
			border-radius: 10px;
			transform: translateY(-50%);
			box-sizing: border-box;
		}
	}
}

.c-layout-side-menu__dropdown {
	.vc-popover-core__container {
		padding-right: 0;
		padding-left: 0;
	}

	.c-layout-side-menu__dropdown-action {
		height: 30px;
		padding: 0 24px;
		font-size: 14px;
		transition: all 0.2s ease-in-out;

		&:hover {
			background: var(--translucent-main);
		}
	}
}
</style>
