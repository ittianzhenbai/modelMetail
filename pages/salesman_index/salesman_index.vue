<template>
	<view class="nonghu-index">
		<view class="per-info">
			<view class="p-left">
				<u-image 
					width="100%" 
					height="100%" 
					shape="circle"
					:src="perinfo.avatar">
				</u-image>
			</view>
			<view class="p-middle">
				<view class="item">
					{{perinfo.realname}}
				</view>
				<view class="item">
					{{perinfo.mobile}}
				</view>
			</view>
			<view class="p-right" @click="modefiy()">
				编辑<u-icon name="arrow-right"></u-icon>
			</view>
		</view>
		<view class="function-points">
			<view 
				v-for="(item,index) in points" 
				:key="index" 
				@click="selPoints(item)"
				class="single-points"
			>
				{{item.text}}
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				perinfo:"",//个人信息
				points:[
					{index:'1',text:'农技示范户管理'},
					{index:'2',text:'零售商管理'},
					{index:'3',text:'农技示范记录'},
					{index:'4',text:'进货情况'},
					{index:'5',text:'技术分享'},
					{index:'6',text:'销售支持'},
					{index:'7',text:'扫码追溯'},
					{index:'8',text:'手工输入追溯'}
				]
			};
		},
		onShow() {
			this.getPerInfo()
			uni.hideHomeButton()
		},
		computed:{
			...mapState(["token","userinfo","wxinfo"]),
		},
		methods:{
			modefiy(){
				uni.navigateTo({
					url:"../personal/personal"
				})
			},
			getPerInfo(){
				let that = this
				this.myRequest({
					url:"member/user/get_user_info",
					method:"POST",
					data:{
						token:that.token
					}
				}).then(res=>{
					if(res.data.code == 1){
						this.perinfo = res.data.data
					}else if(res.data.code == 510 &&res.data.msg == "无效的token参数！"){
						uni.navigateTo({
							url:"../login/login?operation=relogin"
						})
					}
				})
			},
			selPoints(item){
				switch(item.text){
					case "农技示范户管理":
						uni.navigateTo({
							url:"../nonghu_manage/nonghu_manage"
						});
						break;
					case "零售商管理":
						uni.navigateTo({
							url:"../retailer_manage/retailer_manage"
						});
						break;
					case "农技示范记录":
						uni.navigateTo({
							url:"../nong_technology_record/nong_technology_record"
						});
						break;
					case "进货情况":
						uni.navigateTo({
							url:"../enter_products_bysale/enter_products_bysale"
						});
						break;
					case "技术分享":
						uni.navigateTo({
							url:"../technology_share/technology_share?from=salesman_index"
						});
						break;
					case "销售支持":
						uni.navigateTo({
							url:"../sale_support/sale_support"
						});
						break;
					case "扫码追溯":
						uni.navigateTo({
							url:"../scan_trace/scan_trace"
						});
						break;
					case "手工输入追溯":
						uni.navigateTo({
							url:"../input_trace/input_trace"
						});
						break;
					default:
						console.log("点错了");
						break;
				}
			}
		}
	}
</script>

<style lang="stylus" scoped>
.nonghu-index
	overflow auto
	.per-info
		width 100%
		height 210rpx
		background-color #FFFFFF
		border-bottom 1rpx solid #EFEFF4
		.p-left
			width 130rpx
			height 130rpx
			margin 40rpx 30rpx 40rpx 25rpx
			display inline-block
			vertical-align top
		.p-middle
			display inline-block
			width 340rpx
			font-family Microsoft YaHei
			font-weight Regular
			vertical-align top
			.item
				font-size 29rpx
				color #999999
				&:nth-child(1)
					font-size 40rpx
					color #333333
					padding-top 55rpx
					padding-bottom 25rpx
				&:nth-child(2)
					line-height 40rpx
		.p-right
			width 200rpx
			display inline-block
			text-align right
			font-size 28rpx
			line-height 210rpx
			color #EA5413
			font-family Source Han Sans CN
			font-weight 400
	.function-points
		background-color #FFFFFF
		padding 20rpx 25rpx 15rpx 25rpx
		.single-points
			background-color #E4E3FA
			width 340rpx
			height 220rpx
			line-height 180rpx
			display inline-block
			text-align center
			padding 20rpx
			border-radius 10rpx
			font-family Microsoft YaHei
			font-weight Regular
			font-size 34rpx
			margin-bottom 20rpx
			vertical-align top
			&:nth-child(2n+1)
				margin-right 20rpx
				background-color #FAEBE3
			&:nth-child(2n+2)
				background-color #E5F5F2
			&:nth-child(7),&:nth-child(8)
				background-color #DEFEDF	
</style>
