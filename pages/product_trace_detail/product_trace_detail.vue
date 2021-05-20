<template>
	<view class="product-trace">
		<view 
			id="product-info"
			class="product-info">
			<p class="name">{{goods.product_name}} {{goods.product_component}}</p>
			<view class="type">
				规格：{{goods.product_spec}}
			</view>
		</view>
		<scroll-view 
			scroll-x="false"
			scroll-y="true"
			:class="[nodeheight <= 77?'trace-list':nodeheight <= 98?'trace-list trace-list1':'trace-list trace-list2']">
			<view
				v-for="(item,index) in trace_list"
				:key="index"
				@click="goRetailerDetail(item)"
				class="single-list">
				<view class="shop-name">
					{{item.shop_name}}
				</view>
				<view class="address">
					{{item.address}}
				</view>
				<view class="time">
					{{item.type == '1'?'进货':'退货'}}时间：{{item.stock_date}}
				</view>
				<view class="right-icon">
					<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				trace_code:"",//商品的追述码编号
				goods:"",//商品信息
				trace_list:"",//追溯列表
				nodeheight:"",//列表的高度
			};
		},
		computed:{
			...mapState(["token"]),
		},
		onLoad(option) {
			this.trace_code = option.trace_code
		},
		onReady() {
			let view = uni.createSelectorQuery().in(this).select("#product-info");
			let that = this
			view.fields({
			  size: true,
			  scrollOffset: true
			}, data => {
			  // console.log("得到节点信息" + JSON.stringify(data));
			  // console.log("节点的高为" + data.height);
			  that.nodeheight = data.height
			}).exec();
		},
		onShow() {
			this.getTraceResult()
		},
		methods:{
			goRetailerDetail(item){
				uni.navigateTo({
					url:"../retailer_detail/retailer_detail?user_id="+item.user_id+""
				})
			},
			getTraceResult(){
				let that = this
				this.myRequest({
					url:"member/goods/get_goods_flow",
					method:"POST",
					data:{
						token:that.token,
						goods_code:that.trace_code
					}
				}).then(res=>{
					if(res.data.code == 1){
						that.goods = res.data.data.goods
						that.trace_list = res.data.data.list
					}
				})
			},
		}
	}
</script>
<style lang="stylus" scoped>
.product-trace
	width 100%
	height 100%
	overflow auto
	.product-info
		font-family Microsoft YaHei
		font-weight Regular
		color #333333
		padding 22rpx 28rpx
		margin 20rpx 0
		background-color #FFFFFF
		.name
			font-size 38rpx
			margin-bottom 14rpx
		.type
			color #999999
			font-size 28rpx
	.trace-list
		background-color #FFFFFF
		font-family Microsoft YaHei
		font-weight Regular
		color #333333
		min-height 0
		max-height calc(100vh - 186rpx)
		.single-list
			height 200rpx
			margin-left 26rpx
			overflow auto
			position relative
			border-bottom 1rpx solid rgba(0,0,0,0.1)
			.shop-name
				font-size 38rpx
				margin 20rpx 0 18rpx 0
			.address,.time
				color #999999
				font-size 28rpx
			.address
				margin-bottom 4rpx
			.right-icon
				position absolute
				right 29rpx
				top 50%
				transform translateY(-50%)
				color #999999
				font-size 22rpx
			&:last-child
				border-bottom none
	.trace-list1
		max-height calc(100vh - 240rpx)
	.trace-list2
		max-height calc(100vh - 286rpx)
</style>
