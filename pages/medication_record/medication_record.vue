<template>
	<view class="record">
		<scroll-view 
			:scroll-y="true"
			:scroll-x="false"
			:refresher-enabled="true"
			:refresher-triggered="refreshstatus"
			refresher-background="#EFEFF4"
			@refresherpulling="pullDownRefresh"
			@scrolltolower="scrollToBottom"
			class="record-list" 
			v-if="record_list.length != 0">
			<view 
				class="single-record"
				v-for="(item,index) in record_list"
				:key="index"
				@click="watchDetail(item)"
			>
				<view class="left">
					<u-image
						width="100%" 
						height="100%" 
						:src="item.frist_img.replace(/[\\]/g,'/')">
					</u-image>
				</view>
				<view class="right">	
					<p class="text">{{item.crop_name}} {{item.crop_disease}}</p>
					<p class="text">{{item.crop_recipel}}</p>
					<text class="text">最近更新时间：{{item.track_date}}</text>
				</view>
			</view>
			<u-loadmore
				class="load"
				v-show="isloadshow"
				:margin-top="20"
				:margin-bottom="20"
				@loadmore="loadmore"
				:status="status" />
		</scroll-view>
		<view class="no-data" v-if="record_list.length == 0">
			暂无数据
		</view>
		<view class="add-btn-box">
			<button
				class="add_btn"
				@click="addRecord()"
				type="primary">
				新增用药记录
			</button>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				page:1,//页码
				pagesize:10,//每页显示数量
				record_list:[],//农户用药记录
				isshow:false,//控制删除弹窗要不要显示
				isloadshow:false,//控制加载更多要不要显示
				status: 'loadmore',//加载更多组件显示状态
				refreshstatus:false,//控制下拉刷新组件开始和停止
			};
		},
		onShow() {
			this.getRecord(1,this.pagesize)
		},
		computed:{
			...mapState(["token"]),
		},
		methods:{
			addRecord(){
				uni.navigateTo({
					url:"../add_medication_record/add_medication_record"
				})
			},
			scrollToBottom(){
				//滚动到底部
				this.isloadshow = true
			},
			loadmore(){
				//加载更多
				this.status = "loading"
				this.page ++ 
				this.getRecord(this.page,this.pagesize)
			},
			pullDownRefresh(){
				//控制自定义下拉组件刷新
				let that = this
				if(!this.refreshstatus){
					this.refreshstatus = true; //下拉加载，先让其变true再变false才能关闭
					//关闭加载状态 (转动的圈)，需要一点延时才能关闭
					this.getRecord(1,this.pagesize)
				}
			},
			getRecord(page,pagesize){
				//获取用户用药记录
				let that = this
				this.myRequest({
					url:"member/crop/get_crop_list",
					method:"POST",
					data:{
						token:that.token,
						page:page,
						pagesize:pagesize
					}
				}).then(res=>{
					let total = res.data.data.cur_page.total_count
					let allpage = Math.ceil(total/10)
					switch(res.data.code){
						case 210:
							//此时为暂无数据
							that.record_list = []
							setTimeout(()=>{
								that.refreshstatus = false
							},1000)
							break;
						case 1:
							if(page == allpage||page > allpage){
								//如果此次请求的数据小于当前页数量，表示所有数据已经加载完毕
								that.status = "nomore"
							}else{
								//如果此次请求的数据等于当前页数量 表示还有数据可以加载
								that.status = "loadmore"
							}
							if(page == 1){
								that.record_list = res.data.data.list
							}else{
								that.record_list.push(...res.data.data.list)
							}
							setTimeout(()=>{
								that.refreshstatus = false
							},1000)
							break;
						default:
							break;
					}
				})
			},
			watchDetail(item){
				uni.navigateTo({
					url:`../medication_record_detail/medication_record_detail?crop_code=${item.crop_code}`
				})
			}
		}
	}
</script>

<style lang="stylus" scoped>
.record
	width 100%
	height 100%
	overflow auto
	.record-list
		margin-top 20rpx
		height calc(100% - 140rpx)
		.single-record
			background-color #FFFFFF
			padding 35rpx 25rpx
			border-bottom 1rpx solid #EFEFF4
			.left
				width 180rpx
				height 140rpx
				display inline-block
			.right
				width 460rpx
				display inline-block
				margin 0 0 0 29rpx
				vertical-align top
				font-family Microsoft YaHei
				font-weight Regular
				.text
					display block
					font-size 28rpx
					color #999999
					&:nth-child(1)
						color #333333
						font-size 34rpx
						margin-bottom 10rpx
					&:nth-child(2),&:nth-child(3)
						line-height 50rpx
					&:nth-child(1),&:nth-child(2)
						overflow hidden
						text-overflow ellipsis
						white-space nowrap
	.no-data
		margin-top 170rpx
		text-align center
		font-family Microsoft YaHei
		font-weight Regular
		font-size 30rpx
		color #999999
	.add-btn-box
		position fixed
		bottom 0rpx
		width 100%
		background-color #FFFFFF
		height 120rpx
		.add_btn
			box-shadow 0px 3px 10px 0px rgba(0, 0, 0, 0.31)
			height 80rpx
			margin 20rpx 66rpx
			width 618rpx
			line-height 80rpx
			letter-spacing 10rpx
			font-family Microsoft YaHei
			font-weight Regular
			font-size 34rpx
</style>
