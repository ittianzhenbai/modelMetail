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
				class="single-share">
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
				<view class="item1 time">
					{{item.create_time}}
				</view>
				<view
					@click="deleted(item)"
					class="item1 delete-btn">
					删除
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
		<!-- <u-mask
			:show="maskshow" 
			:custom-style="maskstyle"
			>
			<view class="warp">
				<view class="rect" @tap.stop>
				  <view class="scale-img">
					 <u-icon
						@click="maskshow = false"
						class="close-btn" name="close"></u-icon>
				    <movable-area
						class="img-box"
					>
				      <movable-view  
						class="move-box"
						direction="all" 
						:out-of-bounds="true"
						scale-value="1" 
						scale-min="1" 
						scale="true" 
						scale-max="4">
				        <image 
							:src="maskimage" 
							mode="aspectFill"
						>
						</image>
				      </movable-view>
				    </movable-area>	
				  </view>
				</view>
			</view>
		</u-mask> -->
		<Popup
			:title="title"
			:isshow="isshow"
			@getShowStatus="getShowStatus"
			@clickItem="clickItem"
		></Popup>
		<view class="no-data" v-if="record_list.length == 0">
			暂无数据
		</view>
		<view class="add-btn-box">
			<button
				class="add_btn"
				@click="addRecord()"
				type="primary">
				上传分享截图
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
				title:'确定要删除吗？',
				isshow:false,
				page:1,
				pagesize:10,
				record_list:[],//上传分享截图列表
				maskshow:false,//点击查看大图
				sid:"",//分享截图的 sid
				isloadshow:false,//控制加载更多要不要显示
				status: 'loadmore',//加载更多组件显示状态
				isshow:false,//控制删除弹窗要不要显示
				refreshstatus:false,//控制下拉刷新组件开始和停止
			};
		},
		components:{
			Popup,
		},
		onLoad() {
			this.getShareRecord(1,this.pagesize)
		},
		computed:{
			...mapState(["token"]),
		},
		methods:{
			pullDownRefresh(){
				//控制自定义下拉组件刷新
				let that = this
				this.isloadshow = false //每次刷新让加载更多组件消失
				if(!this.refreshstatus){
					this.refreshstatus = true; //下拉加载，先让其变true再变false才能关闭
					//关闭加载状态 (转动的圈)，需要一点延时才能关闭
					this.getShareRecord(1,this.pagesize)
				}
			},
			getShowStatus(Val){
			//弹窗状态发生变化通知父组件
				this.isshow = Val
			},
			deleted(item){
				this.isshow = true
				this.sid = item.sid
			},
			clickItem(val){
				console.log(val)
				if(val == "确定"){
					this.delShareRecord()
				}
			},
			scrollToBottom(){
				// console.log("滚动到底部了")
				this.isloadshow = true
			},
			loadmore(){
				//触发加载更多
				this.status = "loading"
				this.page ++ 
				this.getShareRecord(this.page,this.pagesize)
			},
			watchBigPic(pic){
				let pic_arr = []
				pic_arr.push(pic)
				uni.previewImage({
					urls:pic_arr
				})
			},
			delShareRecord(){
				let that = this
				this.myRequest({
					url:"member/user/delete_share_image",
					method:"POST",
					data:{
						token:that.token,
						sid:that.sid
					}
				}).then(res=>{
					//获取删除成功后的信息
					if(res.data.code == 1 && res.data.msg == "删除分享截图成功"){
						//上传成功后 返回上传截图第一页的显示结果
						that.isloadshow = false //让加载更多组件暂时消失
						that.getShareRecord(1,this.pagesize)
					}
				})
			},
			getShareRecord(page,pagesize){
				let that = this
				this.myRequest({
					url:"member/user/get_share_image",
					method:"POST",
					data:{
						token:that.token,
						page:page,
						pagesize:pagesize
					}
				}).then(res=>{
					//获取上传分享的截图列表
					let total = res.data.data.cur_page.total_count
					let allpage = Math.ceil(total/10)
					switch(res.data.code){
						case 210:
							if(res.data.msg == "暂无数据"){
								that.record_list = []
								setTimeout(()=>{
									that.refreshstatus = false
								},1000)
							}
							break;
						case 1:
							setTimeout(()=>{
								that.refreshstatus = false
							},1000)
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
							break;
						default:
							break;
					}
					
				})
			},
			addShareImage(Val){
				var that = this
				this.myRequest({
					url:"member/user/add_share_image",
					method:"POST",
					data:{
						token:that.token,
						image:Val
					}
				}).then(res=>{
					if(res.data.code == 1 && res.data.msg == "上传分享截图成功"){
						//上传成功后 返回上传截图第一页的显示结果
						that.getShareRecord(1,this.pagesize)
					}
				})
			},
			addRecord(){
				var that = this
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //选择获取图片的方式
					success: function (res) {
						uni.uploadFile({
							url: that.url+'member/upload/image', //仅为示例，非真实的接口地址
							filePath: res.tempFilePaths[0],
							name: 'file',
							formData: {
								'token': that.token
							},
							success: (uploadFileRes) => {
								let tempimage=JSON.parse(uploadFileRes.data)
								that.addShareImage(tempimage.data.url)
							}
						});
					},
					fail:function(res) {
						console.log(res)
					},
				});
			}	
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
		font-size 34rpx
		font-family Microsoft YaHei
		font-weight Regular
		color #333333
		height calc(100% - 140rpx)
		.single-share
			height 200rpx
			padding 30rpx 40rpx 33rpx 25rpx
			border-bottom 1rpx solid rgba(0,0,0,0.1)
			background-color #FFFFFF
			.item1
				display inline-block
				vertical-align top
				line-height 140rpx
			.time
				margin-left 31rpx
			.delete-btn
				font-family Source Han Sans CN
				font-size 28rpx
				font-weight Normal
				color #EA5413
				float right
	// .warp
	// 	height 100%
	// 	width 100%
	// 	.rect
	// 		width 100%
	// 		height 100%
	// 		.scale-img
	// 			width 100%
	// 			height 100%
	// 			position relative
	// 			.close-btn
	// 				z-index 99999
	// 				position absolute
	// 				right 80rpx
	// 				top 60rpx
	// 				color #FFFFFF
	// 				font-size 32rpx
	// 			.img-box
	// 				width 750rpx
	// 				height 480rpx
	// 				z-index 9999
	// 				top 50%
	// 				transform translateY(-50%)
	// 				background-color rgb(0,0,0)
	// 				.move-box
	// 					width 100%
	// 					height 100%
	// 					text-align center
	// 					&>image
	// 						width 750rpx
	// 						height 480rpx			
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
