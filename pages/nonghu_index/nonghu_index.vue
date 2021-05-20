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
					{index:'1',text:'用药记录'},
					{index:'2',text:'上传分享截图'}
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
				if(item.text == "用药记录"){
					uni.navigateTo({
						url:"../medication_record/medication_record"
					})
				}else{
					uni.navigateTo({
						url:"../upload_share/upload_share"
					})
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
		max-height 260rpx
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
				font-size 29rpx
				color #999999
				&:nth-child(1)
					font-size 40rpx
					color #333333
					padding-top 39rpx
					padding-bottom 10rpx
					overflow hidden
					text-overflow ellipsis
					white-space nowrap
				&:nth-child(3),&:nth-child(2)
					line-height 40rpx
		.p-right
			width 100rpx
			display inline-block
			text-align right
			font-size 28rpx
			line-height 210rpx
			color #EA5413
			font-family Source Han Sans CN
			font-weight 400
	.function-points
		background-color #FFFFFF
		padding 20rpx 25rpx
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
			color #333333
			&:nth-child(2n+1)
				margin-right 20rpx
			&:nth-child(2)
				background-color #E3EBFA
				
			
</style>
