<template>
	<view class="page">
		<view class="input-box">
			<u-input 
				v-model="bar_code" 
				:type="type"
				:clearable="true"
				:focus = "true"
				:placeholder="text1"
				:maxlength="32"
				:custom-style="input_style"
				:placeholder-style="placeholder_style"
				:height="height"/>
		</view>
		<u-toast ref="uToast" />
		<button
			:class="[isactive == false?'submit':'submit active1']"
			:disabled="isactive == true? false:true"
			@click="submit()" 
			type="default">提交</button>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				bar_code:'',//条码
				// 测试条码:U20500341651652012110000100035
				type: 'text',
				text1:'请输入条形码下方30位条码',
				border: true,
				height: 100,
				input_style:{
					"fontSize":"30rpx",
					"fontFamily":'Microsoft YaHei',
					"fontWeight":"Regular",
					"paddingLeft":"28rpx",
					"paddingRight":"28rpx",
				},
				placeholder_style:"color:#99999;font-size:28rpx",
				isactive:false
			};
		},
		computed:{
			...mapState(["token"]),
			// isgood(){
			// 	let reg = /^(U\d{29}|\d{32}|[0-9,A-Z]{30})$/;
			// 	let result = reg.test(this.bar_code)
			// 	if(this.bar_code.length == 0){
			// 		return true
			// 	}else if(this.bar_code.length>29){
			// 		return result
			// 	}
			// }
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
					switch(res.data.code){
						case 1:
							that.scanFunctionIsUseable = true
							uni.navigateTo({
								url:"../product_trace_detail/product_trace_detail?trace_code="+that.bar_code+""
							})
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
			submit(){
				this.getTraceResult(this.bar_code)
			}
		},
		watch:{
			bar_code(newVal){
				if(newVal.length >= 30){
					this.isactive = true
				}else{
					this.isactive = false
				}
			},
		}
	}
</script>

<style lang="stylus" scoped>
.page
	height 100%
	width 100%
	overflow auto
	.input-box
		margin-top 20rpx
		margin-bottom 51rpx
		background-color #FFFFFF
		& >>> .u-flex
			padding-right 28rpx
	.submit
		width 619rpx
		margin-left 66rpx
		letter-spacing 10rpx
		font-family Microsoft YaHei
		font-weight Regular
		font-size 34rpx
		border-radius 7rpx
		height 80rpx
		line-height 80rpx
		background-color #BCBCBC
		color #FFFFFF
	.active1
		background-color #1AA93A
</style>
