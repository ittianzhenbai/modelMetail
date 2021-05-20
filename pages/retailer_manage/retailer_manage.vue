<template>
	<view class="nonghu-manage-page">
		<view class="search-box">
			<u-search
				placeholder="请输入姓名或者手机号" 
				bg-color="#FFFFFF"
				:show-action="false"
				:height = "80"
				:shape="squre"
				@search="search"
				:searchIconColor="placeholder_color"
				:placeholder-color="placeholder_color"
				v-model="keyword"></u-search>
		</view>
		<scroll-view
			v-if="retailer_list.length != 0"
			:scroll-y="true"
			:scroll-x="false"
			@scrolltolower="scrollToBottom"
			class="nonghu-list">
			<view 
				v-for="(item,index) in retailer_list"
				:key="index"
				@click="watchDetail(item)"
				class="single-nonghu">
				<view class="nonghu-pic">
					<u-image
						width="130rpx" 
						height="130rpx" 
						shape="circle"
						:src="item.avatar">
					</u-image>
				</view>
				<view class="nonghu-info">
					<p class="item1">
						{{item.realname}} {{item.shop_name}}
					</p>
					<view class="item2">
						{{item.mobile}}
					</view>
					<view class="item2">
						{{item.address}}
					</view>
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
		<view class="no-data" v-if="retailer_list.length == 0">
			暂无数据
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				retailer_list:[],//零售商列表
				placeholder_color:"#999999",//提示文字颜色
				page:1,
				pagesize:10,
				count:"",//零售商数量
				isloadshow:false,//控制加载更多要不要显示
				status: 'loadmore',//加载更多组件显示状态
				isshow:false,//控制删除弹窗要不要显示
				keywords:"",//用户搜索的关键词
				refreshstatus:false,//控制下拉刷新组件开始和停止
			};
		},
		computed:{
			...mapState(["token"]),
		},
		onLoad() {
			this.getRetailerList(this.page,this.pagesize,"")
		},
		onPullDownRefresh() {
			//原生的下拉刷新
			this.refreshstatus = true
			this.isloadshow = false
			this.getRetailerList(1,this.pagesize,this.keywords)
		},
		methods:{
			search(val){
				//搜索的调试是val
				this.keywords = val
				this.getRetailerList(1,this.pagesize,val)
			},
			getRetailerList(page,pagesize,keywords){
				let that = this
				this.myRequest({
					url:"member/retail/get_retails",
					method:"POST",
					data:{
						token:that.token,
						page:page,
						pagesize:pagesize,
						keywords:keywords
					}
				}).then(res=>{
					switch(res.data.code){
						case 1:
							let total = res.data.data.cur_page.total_count
							let allpage = Math.ceil(total/10)
							if(page == 1){
								that.retailer_list = res.data.data.list
							}else{
								that.retailer_list.push(...res.data.data.list)
							}
							//控制加载更多组件的状态
							if(page == allpage||page > allpage){
								//如果此次请求的页码数量 大于或者等于总数据的页数表示当前数据已经加载完毕
								that.status = "nomore"
							}else{
								//如果此次请求的数据等于当前页数量 表示还有数据可以加载
								that.status = "loadmore"
							}
							if(that.refreshstatus == true){
								setTimeout(()=>{
									uni.stopPullDownRefresh()
								},1000)
							}
							break;
						case 210:
							that.retailer_list = []
							break;
						default:
							break;
					}
				})
			},
			scrollToBottom(){
				//监听到滚动到底部了
				this.isloadshow = true
			},
			loadmore(){
				//触发加载更多
				this.status = "loading"
				this.page ++ 
				this.getRetailerList(this.page,this.pagesize,this.keywords)
			},
			watchDetail(item){
				uni.navigateTo({
					url:"../retailer_detail/retailer_detail?user_id="+item.user_id+""
				})
			}
		}
	}
</script>

<style lang="stylus" scoped>
.nonghu-manage-page
	width 100%
	height 100%
	overflow auto
	.search-box
		margin 30rpx 25rpx
	.nonghu-list
		font-family Microsoft YaHei
		font-weight Regular
		color #999999
		font-size 28rpx
		height calc(100% - 140rpx)
		.single-nonghu
			height 200rpx
			width 100%
			background-color #FFFFFF
			border-bottom 1rpx solid rgba(0,0,0,0.1)
			display flex
			.nonghu-pic
				padding 37rpx 40rpx 33rpx 26rpx
				flex 130
			.nonghu-info
				flex 580
				padding-top 30rpx
				.item1
					font-size 38rpx
					width 530rpx
					color #333333
					margin-bottom 18rpx
					overflow hidden
					text-overflow ellipsis
					white-space nowrap
	.no-data
		font-family Microsoft YaHei
		font-weight Regular
		color #999999
		font-size 30rpx
		margin-top 180rpx
		text-align center
	.add_btn
		position fixed
		box-shadow 0px 3px 10px 0px rgba(0, 0, 0, 0.31)
		height 80rpx
		margin 0 66rpx
		width 618rpx
		line-height 80rpx
		bottom 42rpx
		letter-spacing 10rpx
		font-family Microsoft YaHei
		font-weight Regular
		font-size 34rpx
</style>
