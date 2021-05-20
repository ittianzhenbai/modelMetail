<template>
	<view class="tongji-page">
		<view class="sel-option">
			<view class="option" @click="sel_start_time()">
				{{start_time == ""?"开始时间":start_time}}
				<u-icon class="icon" :name="icon1"></u-icon>
				<u-calendar 
					v-model="start_time_show" 
					:mode="mode" 
					:max-date="end_time"
					@change="startChange"></u-calendar>
			</view>
			<view class="option" @click="sel_end_time()">
				<u-calendar
					v-model="end_time_show" 
					:mode="mode" 
					:min-date="start_time"
					@change="endChange"></u-calendar>
				{{end_time == ""?"结束时间":end_time}}
				<u-icon class="icon" :name="icon2"></u-icon>
			</view>
			<view class="option" @click="selStatus()">
				{{status}}
				<u-action-sheet
					@click="clickItem" 
					:list="statusList" 
					:cancel-btn="false"
					:border-radius="17"
					v-model="status_show"></u-action-sheet>
				<u-icon class="icon" :name="icon3"></u-icon>
			</view>
		</view>
		<view class="search-box">
			<u-search 
				placeholder="请输入商品名称" 
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
			v-if="result_list.length != 0"
			:scroll-y="true"
			:scroll-x="false"
			@scrolltolower="scrollToBottom"
			class="products-list">
			<view 
				v-if="res.data.data.list != 0"
				v-for="(item,index) in result_list"
				:key="index"
				class="single-product">
				<p class="pro-name">
					{{item.product_name}} {{item.product_component}}
				</p>
				<view class="pro-type">
					<text class="type">{{item.product_spec}}</text>
					<text v-if="status =='合计'" class="all-pro">总计：{{item.number_stock}}</text>
					<text v-if="status == '退货'||status =='合计'"  class="out-pro">退货：{{item.back_stock}}</text>
					<text v-if="status == '进货'||status =='合计'" class="enter-pro">进货：{{item.enter_stock}}</text>
				</view>
				<view class="time">
					{{item.stock_date}}
				</view>
			</view>
			<u-loadmore
				class="load"
				v-show="isloadshow"
				:margin-top="20"
				:margin-bottom="20"
				@loadmore="loadmore"
				:status="loadstatus" />
		</scroll-view>
		<view class="no-data" v-if="result_list.length == 0">
			暂无数据
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				start_time_show: false,//控制开始时间文字和箭头的变化
				end_time_show: false,//控制结束时间文字和箭头的变化
				mode:'date',
				start_time:'',
				end_time:'',
				status:'合计',//选项 合计 退货 进货
				status_code:1,//选项传参编码 1.全部 2.进货 3退货
				icon1:'arrow-down',
				icon2:'arrow-down',
				icon3:'arrow-down',
				keyword:'',//搜索关键词
				placeholder_color:"#999999",
				status_show:false,
				user_id:"",//零售商的id
				page:1,//当前的页数
				pagesize:10,//每页获取到的数据
				result_list:[],//进退货列表
				isloadshow:false,//控制加载更多要不要显示
				loadstatus: 'loadmore',//加载更多组件显示状态
				refreshstatus:false,//控制下拉刷新组件开始和停止
				statusList: [
					{
						text: '合计'
					},
					{
						text: '进货',
					},
					{
						text: '退货'
					}
				],
			};
		},
		onLoad(options) {
			this.user_id = options.user_id
			this.getResultList(1,this.pagesize)
		},
		onPullDownRefresh() {
			this.refreshstatus = true
			this.getResultList(1,this.pagesize)
		},
		computed:{
			...mapState(["token"]),
		},
		methods:{
			scrollToBottom(){
				//监听滚动到底部
				this.isloadshow = true
			},
			loadmore(){
				//触发滚动加载
				this.loadstatus = "loading"
				this.page ++ 
				this.getResultList(this.page,this.pagesize)
			},
			getResultList(page,pagesize){
				//根据条件搜索进退货统计的结果
				let that = this
				this.myRequest({
					url:"member/goods/get_stock_list",
					method:"POST",
					data:{
						token:that.token,
						page:page,
						pagesize:pagesize,
						start_date:that.start_time,
						end_date:that.end_time,
						goods_name:that.keyword,
						stock_status:that.status_code,
						user_id:that.user_id
					}
				}).then(res=>{
					switch(res.data.code){
						case 1:
							let total = res.data.data.cur_page.total_count
							let allpage = Math.ceil(total/10)
							if(page == 1){
								that.result_list = res.data.data.list
							}else{
								that.result_list.push(...res.data.data.list)
							}
							//控制加载更多组件的状态
							if(page == allpage||page > allpage){
								//如果此次请求的页码数量 大于或者等于总数据的页数表示当前数据已经加载完毕
								//只有此页控制变量为loadstatus
								that.loadstatus = "nomore"
							}else{
								//如果此次请求的数据等于当前页数量 表示还有数据可以加载
								that.loadstatus = "loadmore"
							}
							if(that.refreshstatus == true){
								setTimeout(()=>{
									uni.stopPullDownRefresh()
								},1000)
							}
							break;
						case 210:
							that.result_list = []
							if(that.refreshstatus == true){
								setTimeout(()=>{
									uni.stopPullDownRefresh()
								},1000)
							}
							break;
						default:
							break;
					}
				})
			},
			selStatus(){
				//控制选择 进货 退货或者是合计统计
				this.status_show = true
			},
			clickItem(index) {
				this.status = this.statusList[index].text;
				this.isloadshow = false //让加载更多组件暂时消失
				switch(this.status){
					case "合计":
						this.status_code = 1
						break;
					case "进货":
						this.status_code = 2
						break;
					case "退货":
						this.status_code = 3
						break;
					default:
						this.status_code = 1
						break;
				}
				this.page = 1
				this.getResultList(this.page,this.pagesize,this.keyword)
			},
			startChange(e) {
				//选择开始时间
				this.start_time = e.result
				this.page = 1
				this.isloadshow = false //让加载更多组件暂时消失
				this.getResultList(this.page,this.pagesize,this.keyword)
			},
			endChange(e){
				//选择结束时间
				this.end_time = e.result
				this.page = 1
				this.isloadshow = false //让加载更多组件暂时消失
				this.getResultList(this.page,this.pagesize,this.keyword)
			},
			search(val){
				//搜索的条件是val
				this.keyword = val
				this.page = 1
				this.isloadshow = false //让加载更多组件暂时消失
				this.getResultList(this.page,this.pagesize,this.keyword)
			},
			sel_start_time(){
				//控制选择开始时间的时候日历组件的显示与隐藏 以及箭头的方向 
				this.start_time_show = true
			},
			sel_end_time(){
				//控制选择结束时间的时候日历组件的显示与隐藏 以及箭头的方向 
				this.end_time_show = true
			}
			
		},
		watch:{
			status_show(newVal){
				if(newVal == true){
					this.icon3 = "arrow-up"
				}else{
					this.icon3 = "arrow-down"
				}
			},
			start_time_show(newVal){
				if(newVal == true){
					this.icon1 = "arrow-up"
				}else{
					this.icon1 = "arrow-down"
				}
			},
			end_time_show(newVal){
				if(newVal == true){
					this.icon2 = "arrow-up"
				}else{
					this.icon2 = "arrow-down"
				}
			}
		}
	}
</script>

<style lang="stylus" scoped>
.tongji-page
	height 100%
	width 100%
	overflow auto
	.sel-option
		display flex
		background-color #FFFFFF
		line-height 100rpx
		justify-content center
		border-top 1rpx solid rgba(0,0,0,0.1)
		font-family Microsoft YaHei
		font-weight Regular
		font-size 30rpx
		color #333333
		.option
			flex 1
			text-align center
			box-sizing border-box
			&:nth-child(1),&:nth-child(2)
				border-right 1rpx solid rgba(0,0,0,0.1)
			.icon
				padding-left 19rpx
	.search-box
		margin 30rpx 25rpx
	.products-list
		font-family Microsoft YaHei
		font-weight Regular
		font-size 28rpx
		color #999999
		height calc(100% - 102rpx - 140rpx)
		box-sizing border-box //将border 和 padding也计算在盒子的宽度中
		.single-product
			padding 30rpx 25rpx
			background-color #FFFFFF
			border-bottom 1rpx solid rgba(0,0,0,0.1)
			.pro-name
				color #333333
				font-size 38rpx
				// overflow hidden
				// text-overflow ellipsis
				// white-space nowrap
			.pro-type
				margin 8rpx 0
				.all-pro
					float right
				.out-pro
					float right
					margin-right 30rpx
				.enter-pro
					float right
					margin-right 30rpx
			.timer
				clear both
	.no-data
		font-family Microsoft YaHei
		font-weight Regular
		color #999999
		font-size 30rpx
		margin-top 180rpx
		text-align center
					
</style>
