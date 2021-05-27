<template>
	<view class="page">
		<view class="options">
			<view 
				v-for="(item,index) in options"
				:key="index"
				@click="this.cur_index = index"
				:class="[cur_index == index?'single-option active':'single-option']">
				{{item.text}}
			</view>
		</view>
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
				cur_index:0,//当前选项卡的下标
				bar_code:'',//条码
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
				options:[
					{text:'入库'},
					{text:'退货'},
				],
				isactive:false
			};
		},
		computed:{
			...mapState(["token"]),
		},
		methods:{
			//页面轻提示
			showToast(title) {
				this.$refs.uToast.show({
					title: title,
					type: 'error',
					position:'bottom',
					icon:false
				})
			},
			//商品入库
			enterProduct(good_code){
				let that = this
				this.myRequest({
					url:"member/goods/stock",
					method:"POST",
					data:{
						token:that.token,
						goods_code:good_code
					}
				}).then(res=>{
					//只是返回进货的结果msg，不返回data
					let msg = res.data.msg
					that.showToast(msg)
				})
			},
			//商品退货
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
					//只是返回退货的结果msg，不返回data
					let msg = res.data.msg
					that.showToast(msg)
				})
			},
			//提交操作
			submit(){
				if(this.cur_index == 0 ){
					this.enterProduct(this.bar_code)
				}else if(this.cur_index == 1){
					this.outProduct(this.bar_code)
				}
			}
		},
		watch:{
			//判断按钮是否是激活状态
			bar_code(newVal){
				console.log(newVal)
				if(newVal.length >= 30){
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
	height 100%
	width 100%
	overflow auto
	.options
		font-family Microsoft YaHei
		font-weight Regular
		color #333333
		font-size 30rpx
		display flex
		background-color #FFFFFF
		.single-option
			height 100rpx
			flex 1
			line-height 100rpx
			text-align center
			&:nth-child(1)
				border-right 1rpx solid rgba(0,0,0,0.1)
		.active
			color #1AA93A
			border-bottom 4rpx solid #1AA93A
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
