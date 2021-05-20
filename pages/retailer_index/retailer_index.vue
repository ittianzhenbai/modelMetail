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
				<p class="item">
					{{perinfo.realname}}
					<text class="text1">{{perinfo.shop_name}}</text>
				</p>
				<view class="item">
					{{perinfo.mobile}}
				</view>
				<view class="item">
					{{perinfo.address[0]}}
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
					{index:'1',text:'扫码入库'},
					{index:'2',text:'扫码退货'},
					{index:'3',text:'手工输入入库/退货'},
					{index:'4',text:'进货统计'},
					{index:'5',text:'需要的支持'}
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
					case "扫码入库":
						uni.navigateTo({
							url:"../enter_products/enter_products"
						});
						break;
					case "扫码退货":
						uni.navigateTo({
							url:"../out_products/out_products"
						});
						break;
					case "手工输入入库/退货":
						uni.navigateTo({
							url:"../enter_out_products/enter_out_products"
						});
						break;
					case "进货统计":
						uni.navigateTo({
							url:"../enter_products_statistics/enter_products_statistics?user_id="+this.perinfo.userid+""
						});
						break;
					case "需要的支持":
						uni.navigateTo({
							url:"../need_supports/need_supports"
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
			width 440rpx
			font-family Microsoft YaHei
			font-weight Regular
			vertical-align top
			.item
				font-size 28rpx
				color #999999
				&:nth-child(1)
					font-size 40rpx
					color #333333
					padding-top 39rpx
					padding-bottom 10rpx
					overflow hidden
					text-overflow ellipsis
					white-space nowrap
					.text1
						margin-left 20rpx
				&:nth-child(3),&:nth-child(2)
					line-height 45rpx
		.p-right
			width 100rpx
			display inline-block
			text-align right
			font-size 28rpx
			line-height 210rpx
			color #EA5413
			font-family Source Han Sans CN
			font-weight Normal
	.function-points
		background-color #FFFFFF
		padding 20rpx 25rpx 68rpx 25rpx
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
			background-color #E3F6FA
			vertical-align top
			color #333333
			&:nth-child(2n+1)
				margin-right 20rpx
			&:nth-child(1),&:nth-child(4),&:nth-child(5)
				background-color #F5E3FA
			&:nth-child(3)
				padding 60rpx 95rpx
				line-height 45rpx
				
			
</style>
