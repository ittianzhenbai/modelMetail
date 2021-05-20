<template>
	<view class="page">
		<view class="input-box">
			<u-input 
				v-model="support_text" 
				:type="type" 
				:border="border" 
				:height="height"
				:placeholder="placeholder"
				:maxlength="maxlength"
				:custom-style="input_style"
				:placeholder-style="placeholder_style"
				:auto-height="autoHeight" />
			<text class="count-text">{{count}}/200</text>
		</view>
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
				support_text: '',
				type: 'textarea',
				border: true,
				height: 260,
				autoHeight: true,
				maxlength:200,
				placeholder:"请输入您希望获得的平台支持",
				count:0,//输入的字数
				input_style:{
					"fontSize":"30rpx",
					"fontFamily":'Microsoft YaHei',
					"fontWeight":"Regular",
					"paddingTop":"30rpx",
				},
				placeholder_style:"color:#99999;font-size:30rpx;font-family: Microsoft YaHei;font-weight: 400;",
				isactive:false
			};
		},
		computed:{
			...mapState(["token"]),
		},		
		methods:{
			submit(){
				//提交完之后 跳转到申请列表中
				let that = this
				this.myRequest({
					url:"member/support/apply_support",
					method:"POST",
					data:{
						token:that.token,
						content:that.support_text
					}
				}).then(res=>{
					if(res.data.code == 1){
						uni.navigateBack({
							url:"../need_supports/need_supports"
						})
					}
				})
			}
		},
		watch:{
			support_text(newVal){
				this.count = newVal.length
				if(newVal.length > 0){
					this.isactive = true
				}else{
					this.isactive = false
				}
			}
		}
	}
</script>

<style lang="stylus" scoped>
.page
	width 100%
	height 100%
	overflow auto
	.input-box
		background-color #FFFFFF
		min-height 350rpx
		margin-top 20rpx
		margin-bottom 51rpx
		padding 35rpx 25rpx 23rpx
		text-align right
		font-family Microsoft YaHei
		font-weight Regular
		color #999999
		font-size 24rpx
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
