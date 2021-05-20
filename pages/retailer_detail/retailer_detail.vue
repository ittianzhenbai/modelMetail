<template>
	<view class="retailer_detail">
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
					{{perinfo.realname}} {{perinfo.shop_name}}
				</p>
				<view class="item">
					{{perinfo.mobile}}
				</view>
				<view class="item">
					{{perinfo.address[0]}}
				</view>
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
					{index:'1',text:'进货情况'},
					{index:'2',text:'销售支持'}
				],
				user_id:"",//零售商id
			};
		},
		onLoad(option) {
			this.user_id = option.user_id
			this.getPerInfo(option.user_id)
		},
		computed:{
			...mapState(["token"]),	
		},
		methods:{
			getPerInfo(user_id){
				//获取农技示范户详情
				let that = this
				this.myRequest({
					url:"member/user/get_user_info",
					method:"POST",
					data:{
						token:that.token,
						user_id:user_id
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
			modefiy(){
				uni.navigateTo({
					url:"../personal/personal"
				})
			},
			selPoints(item){
				if(item.text == "进货情况"){
					uni.navigateTo({
						url:"../enter_products_statistics/enter_products_statistics?user_id="+this.user_id+""
					})
				}else{
					uni.navigateTo({
						url:"../sale_support/sale_support?user_id="+this.user_id+""
					})
				}
			}
		}
	}
</script>

<style lang="stylus" scoped>
.retailer_detail
	overflow auto
	height 100%
	width 100%
	background-color #FFFFFF
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
			width 540rpx
			font-family Microsoft YaHei
			font-weight Regular
			vertical-align top
			.item
				font-size 29rpx
				color #999999
				&:nth-child(1)
					font-size 40rpx
					color #333333
					padding-top 39rpx
					padding-bottom 20rpx
					overflow hidden
					text-overflow ellipsis
					white-space nowrap
				&:nth-child(3),&:nth-child(2)
					line-height 40rpx
	.function-points
		background-color #FFFFFF
		padding 20rpx 25rpx
		.single-points
			background-color #E5F5F2
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
			&:nth-child(2n+1)
				margin-right 20rpx
</style>
