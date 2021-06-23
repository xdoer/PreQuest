<template>
	<view class="content">
        <image class="logo" src="../../static/logo.png"></image>
				<view>
            <text class="title">{{title}}</text>
        </view>
				<view @click="go">哈哈哈哈哈</view>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import { prequest } from '@/common/http'

	export default Vue.extend({
		data() {
			return {
				title: 'Hello'
			}
		},
		methods: {
			async go() {
				try {
					const res = await prequest.get('/api')
					console.log('查看响应', res)
				} catch(e) {
					console.log('查看报错', e)
				}
			}
		}
	});
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin: 200rpx auto 50rpx auto;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
