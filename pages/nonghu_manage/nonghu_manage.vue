<template>
	<view class="nonghu-manage-page">
		<view class="search-box">
			<u-search
				placeholder="请输入姓名或手机号" 
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
			:scroll-y="true"
			:scroll-x="false"
			@scrolltolower="scrollToBottom"
			class="nonghu-list" 
			v-if="farmer_list.length != 0">
			<view 
				v-for="(item,index) in farmer_list"
				:key="index"
				@click="watchNongDetail(item)"
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
					<view class="item1">
						{{item.realname}}
					</view>
					<view class="item2">
						{{item.mobile}}
					</view>
					<view class="item2">
						{{item.address}}
					</view>
				</view>
				<view class="del-btn-box" >
					<view
					class="del-btn"
					v-if="item.del_status == 1" 
					@click.stop="deleted(item)"
					>删除</view>
				</view>
				<u-loadmore
					class="load"
					v-show="isloadshow"
					:margin-top="20"
					:margin-bottom="20"
					@loadmore="loadmore"
					:status="status" />
			</view>
		</scroll-view>
		<view class="no-data" v-if="farmer_list.length==0">
			暂无数据
		</view>
		<Popup
			:title="title"
			:isshow="isshow"
			:popuptype = "popuptype"
			@getShowStatus="getShowStatus"
			@getaddValue = "getaddValue"
			@clickItem="clickItem"
		></Popup>
		<view class="add-btn-box">
			<button
				class="add_btn"
				@click="addNonghu()"
				type="primary">
				添加农户
			</button>
		</view>
	</view>
</template>

<script>
	import Popup from "../../components/popup.vue"
	import { mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				popuptype:'',//弹窗类型 增加 通知 其他
				title:'确定要删除吗？',//弹窗标题
				isshow:false,//控制弹窗是否显示
				placeholder_color:"#999999",//输入框搜索图标的颜色
				farmer_list:[],//农机示范户列表
				farmer_id:"",//农户ID
				addfarmer:"",//要增加的用户名
				status: 'loadmore',//加载状态
				isloadshow:false,//控制加载更多要不要显示
				refreshstatus:false,//控制下拉刷新组件开始和停止
				page:1,
				pagesize:10,
			};
		},
		computed:{
			...mapState(["token"]),
		},
		components:{
			Popup,
		},
		onLoad() {
			this.getFarmerList(1,this.pagesize,"")
		},
		onPullDownRefresh() {
			//原生的下拉刷新
			this.refreshstatus = true
			this.getFarmerList(1,this.pagesize,"")
		},
		methods:{
			scrollToBottom(){
				//监听滚动到底部了
				this.isloadshow = true
			},
			loadmore(){
				//加载更多
				this.status = "loading"
				this.page ++ 
				this.getFarmerList(this.page,this.pagesize)
			},
			watchNongDetail(item){
				console.log(item)
				uni.navigateTo({
					url:"../nonghu_detail/nonghu_detail?user_id="+item.farmer_id+""
				})
			},
			search(val){
				//点击手机键盘上的搜索键 或者回车键可以触发搜索操作
				this.getFarmerList(1,this.pagesize,val)
			},
			addNonghu(){
				//点击添加用户以后 触发弹窗 获取输入的用户值 进行添加
				this.title = '添加农户'
				this.popuptype = 'addpopup'
				this.isshow = true
			},
			addFarmer(){
				let that = this
				this.myRequest({
					url:"member/farmer/add_farmer",
					method:"POST",
					data:{
						token:that.token,
						farmer_mobile:that.addfarmer
					}
				}).then(res=>{
					if(res.data.msg == "添加成功"){
						setTimeout(()=>{
							that.isshow = true
							that.title = "添加成功"
							that.popuptype = "tongzhi"
						},1000)
						setTimeout(()=>{
						  that.getFarmerList(1,10,"")
						},2000)
					}else{
						setTimeout(()=>{
							that.isshow = true
							that.title = res.data.msg
							that.popuptype = "tongzhi"
						},1000)
					}
				})
			},
			getShowStatus(Val){
			//弹窗状态发生变化通知父组件
				this.isshow = Val
			},
			getFarmerList(page,pagesize,keywords){
				let that = this
				this.myRequest({
					url:"member/farmer/get_farmers",
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
								that.farmer_list = res.data.data.list
							}else{
								that.farmer_list.push(...res.data.data.list)
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
							that.farmer_list = []
							break;
						default:
							break;
					}
				})
			},
			delFarmerList(){
				let that = this
				this.myRequest({
					url:"member/farmer/delete_farmer",
					method:"POST",
					data:{
						token:that.token,
						farmer_id:that.farmer_id
					}
				}).then(res=>{
					if(res.data.code == 1&&res.data.msg == "删除成功"){
						that.getFarmerList(1,that.pagesize,"")
					}
				})
			},
			deleted(item){
				this.isshow = true
				this.title="确定要删除吗？"
				this.popuptype = "del"
				this.farmer_id = item.farmer_id
			},
			clickItem(val){
				if(val == "确定"){
					this.delFarmerList()
				}else if(val == "增加"){
					console.log("增加")
				}
			},
			getaddValue(Val){
				// console.log("要增加的用户名是：",Val)
				this.addfarmer = Val
				this.addFarmer()
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
		height calc(100% - 120rpx - 140rpx)
		.single-nonghu
			height 200rpx
			width 100%
			background-color #FFFFFF
			border-bottom 1rpx solid rgba(0,0,0,0.1)
			display flex
			.nonghu-pic
				padding 37rpx 8rpx 33rpx 26rpx
				flex 176
			.nonghu-info
				flex 480
				padding-top 30rpx
				.item1
					font-size 38rpx
					color #333333
					margin-bottom 22rpx
			.del-btn-box
				flex 94
				line-height 200rpx
				color #EA5413
				font-size 28rpx
				.del-btn
					width 100%
					height 100%
	.no-data
		font-family Microsoft YaHei
		font-weight Regular
		color #999999
		font-size 30rpx
		margin-top 180rpx
		text-align center
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
