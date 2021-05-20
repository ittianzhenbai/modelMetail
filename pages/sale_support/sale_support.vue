<template>
	<view class="page">
		<scroll-view
			v-if="list.length !== 0"
			:scroll-y="true"
			:scroll-x="false"
			:refresher-enabled="true"
			:refresher-triggered="refreshstatus"
			refresher-background="#EFEFF4"
			@refresherpulling="pullDownRefresh"
			@scrolltolower="scrollToBottom"
			class="need-list">
			<view
				v-for="(item,index) in list"
				:key="index"
				class="single-need">
				<view class="top">
					{{item.content}}
				</view>
				<view class="bottom">
					<text class="shopname" @click="goRetilerDetail(item)">{{item.shop_name}}</text>
					<text class="time">{{item.create_date}}</text>
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
		<view class="no-data" v-if="list.length == 0">
			暂无数据
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				title:'确定要删除吗？',
				isshow:false,
				list:[],
				status: 'loadmore',
				isloadshow:false,//控制加载更多要不要显示
				refreshstatus:false,//控制下拉刷新组件开始和停止
				page:1,//当前获取的页数
				pagesize:10,//每页的数量
				supportid:"",//要删除的某条id的支持
				user_id:"",//零售商id
			};
		},
		computed:{
			...mapState(["token"]),
		},
		onLoad(option) {
			this.user_id = option.user_id
		},
		onShow() {
			this.getNeedList(1,this.pagesize)
		},
		methods:{
			pullDownRefresh(){
				//控制自定义下拉组件刷新
				this.isloadshow = false
				let that = this
				if(!this.refreshstatus){
					this.refreshstatus = true; //下拉加载，先让其变true再变false才能关闭
					//关闭加载状态 (转动的圈)，需要一点延时才能关闭
					this.getNeedList(1,this.pagesize)
				}
			},
			getNeedList(page,pagesize){
				let that = this
				this.myRequest({
					url:"member/support/get_support_list",
					method:"POST",
					data:{
						token:that.token,
						page:page,
						pagesize:pagesize,
						user_id:that.user_id?that.user_id:""
					}
				}).then(res=>{
					switch(res.data.code){
						case 1:
							let total = res.data.data.cur_page.total_count
							let allpage = Math.ceil(total/10)
							if(page == 1){
								that.list = res.data.data.list
							}else{
								that.list.push(...res.data.data.list)
							}
							console.log(page,allpage)
							//控制加载更多组件的状态
							if(page == allpage||page > allpage){
								//如果此次请求的页码数量 大于或者等于总数据的页数表示当前数据已经加载完毕
								that.status = "nomore"
							}else{
								//如果此次请求的数据等于当前页数量 表示还有数据可以加载
								that.status = "loadmore"
							}
							setTimeout(()=>{
								that.refreshstatus = false
							},1000)
							break;
						case 210:
							that.list = []
							setTimeout(()=>{
								that.refreshstatus = false
							},1000)
							break;
						default:
							setTimeout(()=>{
								that.refreshstatus = false
							},1000)
							break;
					}
				})
			},
			scrollToBottom(){
				//监听到滚动到底部
				this.isloadshow = true
			},
			loadmore(){
				//触发加载更多
				this.status = "loading"
				this.page ++ 
				this.getNeedList(this.page,this.pagesize)
			},
			goRetilerDetail(item){
				uni.navigateTo({
					url:"../retailer_detail/retailer_detail?user_id="+item.user_id+""
				})
			}
		}
	}
</script>

<style lang="stylus" scoped>
.page
	width 100%
	height 100%
	overflow auto
	.need-list
		font-family Microsoft YaHei
		font-weight Regular
		color #333333
		font-size 34rpx
		margin-top 20rpx
		height calc(100% - 20rpx)
		.single-need
			padding 28rpx 30rpx 34rpx 24rpx
			border-bottom 1rpx solid rgba(0,0,0,0.1)
			background-color #FFFFFF
			.top
				margin-bottom 30rpx
			.bottom
				font-size 30rpx
				.time
					color #999999
				.shopname
					color #999999
					margin-right 10rpx
	.no-data
		margin-top 170rpx
		text-align center
		font-family Microsoft YaHei
		font-weight Regular
		font-size 30rpx
		color #999999
</style>
