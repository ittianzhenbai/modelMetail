<template>
	<view class="page">
		<view class="camera-box">
			<camera
				class='scan-camera' 
				mode="scanCode" 
				@error="cameraError" 
				flash="auto" 
				@scancode='scancode' 
				frame-size='large'>
			</camera>
			<cover-image class="border-top-left" src="../../static/border-top-left.png"></cover-image>
			<cover-image class="border-top-right" src="../../static/border-top-right.png"></cover-image>
			<cover-image class="border-bottom-left" src="../../static/border-bottom-left.png"></cover-image >
			<cover-image class="border-bottom-right" src="../../static/border-bottom-right.png"></cover-image>
			<cover-view class="run-line"></cover-view>
		</view>
		<view class="sel-album" @click="scancodeAlbum()">
			<u-icon name="photo"></u-icon>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				scanFunctionIsUseable:true,//是否现在可以扫描了
			};
		},
		computed:{
			...mapState(["token"]),
		},
		methods:{
			showToast(title) {
				this.$refs.uToast.show({
					title: title,
					type: 'error',
					position:'bottom',
					icon:false
				})
			},
			outProduct(good_code){
				let that = this
				this.myRequest({
					url:"member/goods/back_stock",
					method:"POST",
					data:{
						token:that.token,
						goods_code:good_code
					}
				}).then(res=>{
					that.showToast(res.data.msg)
					setTimeout(() => {
						that.scanFunctionIsUseable = true
					}, 1000)
				})
			},
			scancode(e){
				if(this.scanFunctionIsUseable == true) {
					this.scanFunctionIsUseable = false
					// 对扫码结果进行处理
					if(e.detail.type == "qrcode"||e.detail.type == "QR_CODE"){
						//扫描二维码获取到的是一个网址，扫描条码获取到的直接是good_code
						//当扫描的是二维码的时候
						var index = e.detail.result.indexOf('syjn='); // 字符出现的位置
						var good_code = e.detail.result.substring(index+5)
						if(index == -1 ){
							//找不到syjn这个字符证明不是石原金牛的商品
							this.showToast("该商品不是石原金牛商品")
							this.scanFunctionIsUseable = true
						}else{
							this.outProduct(good_code)
						}
					}else{
						//当扫描的是条码的时候
						var good_code = e.detail.result
						let reg = /^(U\d{29}|\d{32}|[0-9,A-Z]{30})$/;
						let result = reg.test(good_code)
						console.log("条码信息为：",good_code,result)
						if(good_code.length >= 30 && result == true){
							//只有扫码获取到的商品码是30位的时候才会进行请求
							this.outProduct(good_code)
						}else{
							//扫码识别不清楚的时候重新进行扫码
							this.scanFunctionIsUseable = true
						}
					}
				}
			},
			cameraError(e){
				this.showToast("请重新扫码")
			},
			scancodeAlbum(){
				let that = this
				uni.scanCode({
					scanType:["qrCode","barCode"],
					success:function(res){
						if(res.scanType == "QR_CODE"){
							var index = res.result.indexOf('syjn='); // 字符出现的位置
							var good_code = res.result.substring(index+5)
							if(index == -1){
								//表示未找到相关的syjn的标识 不是石原金牛的产品
								that.showToast("该商品不是石原金牛商品")
							}else{
								that.outProduct(good_code)
							}
						}else{
							var good_code = res.result
							let reg = /^(U\d{29}|\d{32}|[0-9,A-Z]{30})$/;
							let result = reg.test(good_code)
							if(good_code.length >= 30 && result == true){
								//只有扫码获取到的商品码是大于30位的时候并且条码格式符合规则的时候才会进行请求
								that.enterProduct(good_code)
							}
						}
					},
					fail:function(res) {
						console.log("扫码出错了")
						that.showToast("该条码不是商品条码")
					}
				})
			}
		}
	}
</script>

<style lang="stylus" scoped>
.page
	width 100%
	height 100%
	background-color rgba(0,0,0,0.7)
	.camera-box
		position relative
		top 220rpx
		.scan-camera
			position relative
			left 50%
			transform translateX(-50%)
			width 500rpx
			height 500rpx
		.border-top-left,
		.border-top-right,
		.border-bottom-left,
		.border-bottom-right
			width 128rpx
			height 128rpx
			position absolute
		.border-top-left 
			top 0rpx
			left calc(50vw - 250rpx)
		.border-top-right
			top 0rpx
			right calc(50vw - 250rpx)
		.border-bottom-left
			bottom 0rpx
			left calc(50vw - 250rpx)
		.border-bottom-right
			bottom 0rpx
			right calc(50vw - 250rpx)
		.run-line
			width 450rpx
			margin 0 auto
			height 6rpx
			background-color red
			position absolute
			top 30rpx
			left 50%
			transform translateX(-50%)
			animation:run 3s linear infinite
			@keyframes run
				0%
					top 40rpx
				100%
					top 450rpx
	.sel-album
		width 100rpx
		height 100rpx
		background-color rgba(0,0,0,0.5)
		position fixed
		bottom 108rpx
		left 50%
		transform translateX(-50%)
		border-radius 50%
		color #FFFFFF
		text-align center
		line-height 100rpx
		font-size 42rpx
</style>
