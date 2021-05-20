<template>
	<view class="nonghu-record">
		<view
			v-if="record_list.length !== 0"
			class="record-list">
			<view 
				v-for="(item,index) in record_list"
				:key="index"
				@click="watchDetail(item)"
				class="single-record">
				<view class="image-box">
					<u-image
						:src= "item.frist_img.replace(/[\\]/g,'/')" 
						:lazy-load="true"
						:width = "180"
						:height= "140"
						:border-radius = "10"
						>
					</u-image>
				</view>
				<view class="record-info">
					<view class="text1">
						{{item.realname}}
					</view>
					<p class="text2 text3">
						{{item.crop_disease}}
					</p>
					<p class="text2 text3">
						{{item.crop_recipel}}
					</p>
					<view class="text2">
						最近更新时间：{{item.track_date}}
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
		</view>
		<view class="no-data" v-if="record_list.length == 0">
			暂无数据
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				record_list:[],//农技示范户记录
				page:1,//当前页面
				pagesize:10,//每页的数据量,
				form:"",//判断页面来源
				user_id:"",//判断用户id
				isloadshow:false,//控制加载更多要不要显示
				status: 'loadmore',//加载更多组件显示状态
				refreshstatus:false,//控制下拉刷新组件开始和停止
			};
		},
		computed:{
			...mapState(["token"]),
		},
		onLoad(option) {
			this.user_id = option.user_id - 0
		},
		onShow() {
			this.getCropList(1,this.pagesize)
		},
		onReachBottom() {
			//原生的滚动到底部检测
			this.isloadshow = true
		},
		onPullDownRefresh() {
			//原生的下拉刷新
			this.refreshstatus = true
			this.getCropList(1,this.pagesize)
		},
		methods:{
			loadmore(){
				//加载更多
				this.status = "loading"
				this.page ++ 
				this.getCropList(this.page,this.pagesize)
			},
			getCropList(page,pagesize){
				//获取农技示范户列表
				let that = this
				this.myRequest({
					url:"member/crop/get_crop_list",
					method:"POST",
					data:{
						token:that.token,
						page:page,
						pagesize:pagesize,
						user_id:that.user_id
					}
				}).then(res=>{
					switch(res.data.code){
						case 1:
							let total = res.data.data.cur_page.total_count
							let allpage = Math.ceil(total/10)
							if(page == 1){
								that.record_list = res.data.data.list
							}else{
								that.record_list.push(...res.data.data.list)
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
							that.record_list = []
							break;
						default:
							break;
					}
				})
			},
			watchDetail(item){
				uni.navigateTo({
					url:"../medication_record_detail/medication_record_detail?crop_code="+item.crop_code+"&from="+'yewuyuan'+""
				})
			},
		}
	}
</script>

<style lang="stylus" scoped>
.nonghu-record
	width 100%
	height 100%
	.record-list 
		font-family Microsoft YaHei
		font-weight Regular
		color #999999
		font-size 28rpx
		box-sizing border-box
		.single-record
			margin-top 20rpx
			height 250rpx
			background-color #FFFFFF
			box-sizing border-box
			.image-box
				display inline-block
				margin 50rpx 29rpx auto 25rpx
			.record-info
				display inline-block
				vertical-align top
				width 494rpx
				.text1
					color #333333
					margin-top 29rpx
					margin-bottom 12rpx
					font-size 38rpx
				.text2
					line-height 48rpx
				.text3
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
</style>
