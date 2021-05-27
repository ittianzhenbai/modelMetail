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
		<view 
			class="result" 
			v-show="show">
			<view class="top">
				已有：{{count}}
			</view>
			<view class="content">
				<scroll-view scroll-y="true" style="height: 300rpx;">
					<view>
						<view 
							class="single-product" 
							v-for="(item,index) in goods_list" 
							:key="index">
							<view class="row">
								<text class="pro-text">{{item.product_name}}</text>
								{{item.product_component}}
							</view>
							<view class="row2">
								<text class="pro-text">{{item.product_spec}}</text>
							</view>
							<view class="row2">
								<text class="pro-text">编码：{{item.security_code}}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				scanFunctionIsUseable:true,//是否现在可以进行扫码了
				show: false,//控制下面是否显示商品信息
				goods_list:[],//入库商品列表
				count:"",//入库数量
				height:"400",//下面进货信息弹窗面板显示
			};
		},
		onShow() {
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
			enterProduct(good_code){
				//商品入库
				let that = this
				this.myRequest({
					url:"member/goods/stock",
					method:"POST",
					data:{
						token:that.token,
						goods_code:good_code
					}
				}).then(res=>{
					let msg = res.data.msg
					that.showToast(msg)
					if(res.data.code = 1){
						that.goods_list = res.data.data.list
						that.count = res.data.data.count 
					}
					setTimeout(() => {
						that.scanFunctionIsUseable = true
					}, 300)
				})
			},
			//扫码
			scancode(e){
				if(this.scanFunctionIsUseable == true) {
					//加入这个限制扫码频率
					this.scanFunctionIsUseable = false
					// 对扫码结果进行处理
					//安卓获取到的是qrcode ios获取到的是QR_CODE
					if(e.detail.type == "qrcode" || e.detail.type == "QR_CODE"){
						//扫描二维码获取到的是一个网址，扫描条码获取到的直接是good_code
						//当扫描的是二维码的时候
						var index = e.detail.result.indexOf('syjn='); // 字符出现的位置
						var good_code = e.detail.result.substring(index+5)
						if(index == -1 ){
							//找不到syjn这个字符证明不是石原金牛的商品
							this.showToast("该商品不是石原金牛商品")
							this.scanFunctionIsUseable = true
						}else{
							//找不到syjn这个字符证明不是石原金牛的商品
							this.enterProduct(good_code)
						}
					}else{
						//当扫描的是条码的时候
						var good_code = e.detail.result
						let reg = /^(U\d{29}|\d{32}|[0-9,A-Z]{30})$/;
						let result = reg.test(good_code)
						// console.log("条码信息为：",good_code,result)
						if(good_code.length >= 30 && result == true){
							//只有扫码获取到的商品码是30位的时候才会进行请求
							this.enterProduct(good_code)
						}else{
							this.showToast("该商品不是石原金牛商品")
							this.scanFunctionIsUseable = true
						}
					}
				}
			},
			//扫码错误的回调
			cameraError(e){
				console.log(e.detail);
				this.showToast("该条码不是商品条码")
			},
			//扫码，从相册中进行扫码
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
								that.enterProduct(good_code)
							}
						}else{
							var good_code = res.result
							let reg = /^(U\d{29}|\d{32}|[0-9,A-Z]{30})$/;
							let result = reg.test(good_code)
							if(good_code.length >= 30 && result == true){
								//只有扫码获取到的商品码是大于30位的时候才会进行请求
								this.enterProduct(good_code)
							}
						}
					},
					fail:function(res) {
						that.showToast("请重新扫码")
					}
				})
			}
		},
		watch:{
			count(newVal){
				if(newVal > 0){
					//如果入库商品数量大于0 就显示下方信息
					this.show = true
				}
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
		top 120rpx
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
		margin 156rpx auto 50rpx
		border-radius 50%
		color #FFFFFF
		text-align center
		line-height 100rpx
		font-size 42rpx
	.result
		font-family Microsoft YaHei
		font-weight Regular
		color #333333
		overflow-y hidden
		position fixed
		width 100%
		box-sizing border-box
		bottom 0
		left 0
		.top
			font-size 28rpx
			height 98rpx
			padding-left 30rpx
			line-height 100rpx
			background-color #EFEFF4
			border-top-left-radius 20rpx
			border-top-right-radius 20rpx
		.content
			background-color #FFFFFF
			height 300rpx
			.single-product
				height 150rpx
				margin-left 31rpx
				padding 15rpx 31rpx 15rpx 0
				border-bottom 1rpx solid rgba(0,0,0,0.1)
				font-size 34rpx
				.row
					color #333333
					overflow hidden
					text-overflow ellipsis
					white-space nowrap
					.pro-text
						margin-right 20rpx
				.row2
					font-size 28rpx
					color #999999
</style>
