<template>
	<view class="record-detail">
		<scroll-view 
			:scroll-y="true"
			:class="[from == 'yewuyuan'?'record-list from-yewuyuan':'record-list']">
			<view v-if="from == 'yewuyuan'" class="user-name">
				{{realname}} {{mobile}}
			</view>
			<view 
				class="single-record"
				v-for="(item,index) in recordlist"
				:key="index"
			>
				<view class="text1">记录时间：{{item.create_time}}</view>
				<view class="text1" v-if="index == 0"><text class="text2">作</text>物：{{item.crop_name}}</view>
				<view class="text1" v-if="index == 0"><text class="text2">病</text>情：{{item.crop_disease}}</view>
				<view class="text1" v-if="index > 0">上次用药效果：{{item.crop_effect}}</view>
				<view class="pic"
					v-for="(item1,index1) in item.crop_img"
					:key="index1"
				>
					<u-image
						width="100%" 
						height="342rpx"
						@click="watchBigPic(item1)"
					    :src="item1">
						<u-loading slot="loading"></u-loading>
					</u-image>
				</view>
				<view class="text1 text3">{{item.crop_recipel}}</view>
			</view>
		</scroll-view>
		<view
			v-if="from != 'yewuyuan'"
			class="add-btn-box">
			<button
				class="add_btn"
				@click="addRecord()"
				type="primary">
				添加记录
			</button>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				from:'',//判断页面来源
				recordlist:[],//获取到的记录列表
				crop_code:"",//跟踪作物编码
				mobile:"",//用户手机号
				realname:"",//用户姓名
			};
		},
		onLoad(option) {
			//接收上个页面传递的参数
			this.crop_code = option.crop_code
			if(option.crop_code){
				//如何获取到用药记录的详情进行请求
				this.getRecordDetail(option.crop_code)
			}
			this.from = option.from
			if(option.from == 'yewuyuan'){
				uni.setNavigationBarTitle({
				    title: '农技示范记录详情'
				});
			}
		},
		computed:{
			...mapState(["token"]),
		},
		methods:{
			watchBigPic(pic){
				let pic_arr = []
				pic_arr.push(pic)
				uni.previewImage({
					urls:pic_arr
				})
			},
			addRecord(){
				uni.navigateTo({
					url:`../continue_record/continue_record?crop_code=${this.crop_code}`
				})
			},
			getRecordDetail(crop_code){
				let that = this
				this.myRequest({
					url:"member/crop/get_crop_detail",
					method:"POST",
					data:{
						token:that.token,
						crop_code:crop_code
					}
				}).then(res=>{
					if(res.data.code == 1){
						that.recordlist = res.data.data.list
						that.mobile = res.data.data.list[0].mobile
						that.realname = res.data.data.list[0].realname
					}
				})
			}
		}
	}
</script>

<style lang="stylus" scoped>
.record-detail
	width 100%
	height 100%
	overflow auto
	.record-list
		margin-top 20rpx
		background-color #FFFFFF
		padding 29rpx 25rpx
		box-sizing border-box
		height calc(100% - 150rpx)
		.user-name
			margin-top 11rpx
			margin-bottom 29rpx
			font-family Microsoft YaHei
			font-weight Regular
			font-size 34rpx
			color #333333
		.single-record
			border 1rpx solid #E5E5E5
			padding 30rpx
			margin-bottom 19rpx
			.text1
				display block
				margin-bottom 30rpx
				font-size 30rpx
				font-family Microsoft YaHei
				font-weight Regular
				color #333333
				.text2
					letter-spacing 60rpx
			.text3
				text-align left
			.pic
				margin-bottom 10rpx
				&:last-child
					margin-bottom 20rpx
	.from-yewuyuan
		height calc(100% - 20rpx)
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
