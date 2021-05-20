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
			<cover-image  class="border-top-left" src="../../static/border-top-left.png"></cover-image>
			<cover-image  class="border-top-right" src="../../static/border-top-right.png"></cover-image>
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
				scanFunctionIsUseable:true,
				show: false,
				good_code:"",//商品唯一标识码
				limitroute:true,//限制多次跳往详情页面
			};
		},
		computed:{
			...mapState(["token"]),
		},
		onShow() {
			//相机组件扫码会有延迟 进行多次请求 导致跳转到详情页多次，每次从详情页返回后初始化赋值
			this.limitroute = true
			this.scanFunctionIsUseable = true
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
			getTraceResult(trace_code){
				let that = this
				this.myRequest({
					url:"member/goods/get_goods_flow",
					method:"POST",
					data:{
						token:that.token,
						goods_code:trace_code
					}
				}).then(res=>{
					// console.log("产品追述结果为：",res)
					switch(res.data.code){
						case 1:
							if(that.limitroute == true){
								that.scanFunctionIsUseable = true
								uni.navigateTo({
									url:"../product_trace_detail/product_trace_detail?trace_code="+trace_code+"",
								})
								that.limitroute = false
							}
							break;
						case 0:
							that.scanFunctionIsUseable = true
							//弹窗提示对应的错误信息
							that.showToast(res.data.msg)
							break;
						default:
							that.scanFunctionIsUseable = true
							break;
					}
				})
			},
			scancode(e){
				if(this.scanFunctionIsUseable == true) {
					this.scanFunctionIsUseable = false
					// 对扫码结果进行处理
					// console.log("组件扫码获取到的信息为：",e.detail.result,e)
					if(e.detail.type == "qrcode" || e.detail.type == "QR_CODE"){
						console.log("这边应该执行的")
						//扫描二维码获取到的是一个网址，扫描条码获取到的直接是good_code
						//当扫描的是二维码的时候
						var index = e.detail.result.indexOf('syjn='); // 字符出现的位置
						var good_code = e.detail.result.substring(index+5)
						if(index == -1 ){
							this.showToast("该商品不是石原金牛商品")
							this.scanFunctionIsUseable = true
						}else{
							//找不到syjn这个字符证明不是石原金牛的商品
							this.good_code = good_code
							this.getTraceResult(good_code)
						}
					}else{
						//当扫描的是条码的时候
						var good_code = e.detail.result
						if(good_code.length >= 30){
							//只有扫码获取到的商品码是30位的时候才会进行请求
							this.getTraceResult(good_code)
						}else{
							//如果扫码不正确 请重新扫码
							this.scanFunctionIsUseable = true
						}
					}
					
				}
			},
			cameraError(e){
				this.showToast("该条码不是商品条码")
			},
			scancodeAlbum(){
				let that = this
				uni.scanCode({
					scanType:["qrCode","barCode"],
					success:function(res){
						console.log("客户端扫码获取到的信息",res)
						if(res.scanType == "QR_CODE"){
							var index = res.result.indexOf('syjn='); // 字符出现的位置
							var good_code = res.result.substring(index+5)
							if(index == -1){
								//表示未找到相关的syjn的标识 不是石原金牛的产品
								that.showToast("该商品不是石原金牛商品")
							}else{
								that.good_code = good_code
								that.getTraceResult(good_code)
							}
						}else{
							var good_code = res.result
							if(good_code.length >= 30){
								//只有扫码获取到的商品码是30位的时候才会进行请求
								this.getTraceResult(good_code)
							}
						}
					},
					fail:function(res) {
						if(res.errMsg == "scanCode:fail"){
							console.log("扫码出错了",res)
							that.showToast("该条码不是商品条码")
						}
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
		right 53rpx
		border-radius 50%
		color #FFFFFF
		text-align center
		line-height 100rpx
		font-size 42rpx
</style>
