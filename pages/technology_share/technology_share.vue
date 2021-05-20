<template>
	<view class="share-pic">
		<scroll-view 
			v-if="record_list.length != 0"
			:scroll-y="true"
			:scroll-x="false"
			:refresher-enabled="true"
			:refresher-triggered="refreshstatus"
			refresher-background="#EFEFF4"
			@refresherpulling="pullDownRefresh"
			@scrolltolower="scrollToBottom"
			class="share-list">
			<view 
				v-for="(item,index) in record_list"
				:key="index"
				class="single-share"
				>
				<view class="item1 pic">
					<u-image 
						:src="item.image" 
						:lazy-load="true"
						:width = "180"
						:height= "140"
						:border-radius = "10"
						@click="watchBigPic(item.image)"
						>
					</u-image>
				</view>
				<view 
					@click="watchNonghu(item)"
					class="item1 info"
					>
					<view class="name">
						{{item.realname}}
					</view>
					<view class="time">
						{{item.create_time}}
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
		<view class="no-data" v-if="record_list.length==0">
			暂无数据
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				page:1,
				pagesize:10,
				record_list:[],//上传分享截图列表
				maskshow:false,//点击查看大图
				sid:"",//分享截图的 sid
				user_id:"",
				from:"",//判断页面来源
				isloadshow:false,//控制加载更多要不要显示
				status: 'loadmore',//加载更多组件显示状态
				refreshstatus:false,//控制下拉刷新组件开始和停止
			};
		},
		onLoad(option) {
			//获取当前用户的id
			this.user_id = option.user_id
			this.from = option.from
			console.log(option)
			this.getShareRecord(this.page,this.pagesize)
		},
		computed:{
			...mapState(["token"]),
		},
		methods:{
			pullDownRefresh(){
				//控制自定义下拉组件刷新
				this.isloadshow = false //每次刷新让加载更多组件消失
				let that = this
				if(!this.refreshstatus){
					this.refreshstatus = true; //下拉加载，先让其变true再变false才能关闭
					//关闭加载状态 (转动的圈)，需要一点延时才能关闭
					this.getShareRecord(1,this.pagesize)
				}
			},
			scrollToBottom(){
				//监听到滚动到底部
				this.isloadshow = true
			},
			loadmore(){
				//触发加载更多
				this.status = "loading"
				this.page ++ 
				this.getShareRecord(this.page,this.pagesize)
			},
			watchNonghu(item){
				if(this.from == "salesman_index"){
					uni.navigateTo({
						url:`../nonghu_detail/nonghu_detail?user_id=${item.user_id}`
					})
				}else if(this.from == "nonghu_detail"){
					console.log("我是农户，不用重新跳到我首页")
				}
			},
			watchBigPic(pic){
				let pic_arr = []
				pic_arr.push(pic)
				uni.previewImage({
					urls:pic_arr
				})
			},
			getShareRecord(page,pagesize){
				//获取农技示范列表
				let that = this
				this.myRequest({
					url:"member/user/get_share_image",
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
							setTimeout(()=>{
								that.refreshstatus = false
							},1000)
							break;
						case 210:
							that.record_list = []
							break;
						default:
							break;
					}
				})
			},
		}
	}
</script>

<style lang="stylus" scoped>
.share-pic
	width 100%
	height 100%
	overflow auto
	.share-list
		margin-top 20rpx
		font-size 38rpx
		font-family Microsoft YaHei
		font-weight Regular
		color #333333
		height calc(100% - 20rpx)
		.single-share
			height 200rpx
			padding 30rpx 40rpx 33rpx 25rpx
			background-color #FFFFFF
			border-bottom 1rpx solid rgba(0,0,0,0.1)
			.item1
				display inline-block
				vertical-align top
			.info
				margin-left 31rpx
				width calc(100% - 140rpx - 96rpx)
				.name
					margin 20rpx 0 10rpx 0
				.time
					color #999999
					font-size 28rpx
	.no-data
		font-family Microsoft YaHei
		font-weight Regular
		color #999999
		font-size 30rpx
		margin-top 180rpx
		text-align center
</style>
