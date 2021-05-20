<template>
	<view class="agreement-page">
		<view 
			class="content">
			<view class="title">
				{{title}}
			</view>
			<u-parse 
				:show-with-animation="true"
				:html="content">
			</u-parse>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				content:"",//协议内容
				title:""
			};
		},
		computed:{
			...mapState(["token"]),
		},
		onLoad() {
			this.getUserAgreement()
		},
		methods:{
			getUserAgreement(){
				let that = this
				this.myRequest({
					url:"api/app/service_agreement",
					method:"POST",
				}).then(res=>{
					//获取用户隐私政策的内容
					that.content = res.data.data.content
					that.title = res.data.data.title
				})
			}
		}
	}
</script>

<style lang="stylus" scoped>
.agreement-page
	width:100%
	height 100%
	overflow auto
	padding 35rpx 25rpx 0
	.content
		font-size 24rpx
		font-family Microsoft YaHei
		font-weight Regular
		color #666666
		line-height 1.8
		.title
			text-align center
			font-size 32rpx
</style>
