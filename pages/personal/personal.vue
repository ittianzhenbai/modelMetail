<template>
	<view class="personal">
		<view class="per-info">
			<view class="item1 per-img">
				<view class="item1-contain"
					@click="modefiyImg()"
				>
					<view class="left">
						头像
					</view>
					<view class="right">
						<view class="image">
							<u-image
								:width="130" 
								:height="130"
								shape="circle"
								:src="src">
							</u-image>
						</view>
						<u-icon class="icon" name="arrow-right"></u-icon>
					</view>
				</view>
			</view>
			<view class="item2">
				<u-field
					v-model="mobile"
					label="用户名"
					:field-style = "fieldstyle"
					:input-align="inputAlign"
					:disabled="true"
				>
				</u-field>
				<u-field
					v-model="username"
					label="名字"
					:maxlength='10'
					:clearable='false'
					:input-align="inputAlign"
					:right-icon="right_icon"
					:field-style = "fieldstyle"
				>
				</u-field>
				<u-field
					v-if="usertype == '2'"
					v-model="shopname"
					label="店铺名"
					:maxlength='10'
					:clearable='false'
					:input-align="inputAlign"
					:right-icon="right_icon"
					:field-style = "fieldstyle"
				>
				</u-field>
				<u-field
					v-if="usertype == '2'|| usertype == '1'"
					v-model="address"
					label="所在地"
					:input-align="inputAlign"
					@click="selAddress"
					:disabled="true"
					:right-icon="right_icon"
					:field-style = "fieldstyle"
				>
				</u-field>
			</view>
			<view class="item1">
				<view
					class="item1-contain options" 
					v-for="(item,index) in options"
					:key = "index"
					@click="watchAgreement(index)">
					<view class="left">
						{{item.text}}
					</view>
					<view class="right">
						<u-icon class="icon1" name="arrow-right"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<u-picker
			mode="region" 
			v-model="show_address" 
			:area-code='["33", "3301", "330108"]' 
			@cancel="cancel()"
			@confirm="confirm()"
			:params="params"></u-picker>
		<u-action-sheet
			@click="clickItem" 
			:list="selList" 
			:border-radius="17"
			v-model="actionshow"></u-action-sheet>
		<Popup
			:title="title"
			:isshow="isshow"
			@getShowStatus="getShowStatus"
			@clickItem = "getclickItem"
		></Popup>
		<button 
			class="reserve"
			type="primary"
			@click="reserve()"
		>
			保存
		</button>
	</view>
</template>

<script>
	import Popup from "../../components/popup.vue"
	import { mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				src:"",//头像图片地址
				title:'确定要退出登录吗？',
				isshow:false,//控制退出登录弹窗是否显示
				show_address:false,//地址选择面板
				mobile:'18888888888',//用户手机号
				username:'用户甲',//用户的姓名
				shopname:"",//店铺名
				address:"浙江省杭州市滨江区",//文字地址
				address1:"",//地址id
				actionshow:false,
				right_icon:"arrow-right",
				inputAlign:'right',
				fieldstyle:{
					'fontSize':'30rpx',
					'color':'#333333',
					'paddingLeft':'30rpx'
				},
				params:{
					province: true,
					city: true,
					area: true
				},
				options:[
					{text:'用户协议'},
					{text:'用户隐私'},
					{text:'退出登录'},
				],
				selList: [
					{
						text: '拍照',
					},
					{
						text: '从手机相册选择'
					}
				],
			};
		},
		onLoad() {
			this.getPerInfo()
		},
		computed:{
			...mapState(["token","userinfo","usertype"]),
		},
		components:{
			Popup,
		},
		methods:{
			modefiyImg(){
				this.actionshow = true
			},
			getPerInfo(){
				let that = this
				this.myRequest({
					url:"member/user/get_user_info",
					method:"POST",
					data:{
						token:that.token
					}
				}).then(res=>{
					if(res.data.code == 1){
						let perinfo = res.data.data
						this.username = perinfo.realname
						this.mobile = perinfo.mobile
						this.shopname = perinfo.shop_name
						this.address = perinfo.address[0]
						this.address1 = perinfo.address[1]
						this.src = perinfo.avatar
					}
				})
			},
			getclickItem(val){
				//选择退出登录执行的操作
				if(val == "确定"){
					try {
					    uni.clearStorageSync();
						setTimeout(()=>{
							uni.reLaunch({
								url:"../login/login?operation=relogin"
							})
						},1000)
					} catch (e) {
					    // error
					}
				}
			},
			clickItem(item){
				let that = this
				console.log(item)
				let sourceType = ""
				if(item == 0){
					sourceType = "camera"
				}else{
					sourceType = "album"
				}
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: [sourceType], //选择获取图片的方式
					success: function (res) {
						uni.uploadFile({
							url: that.url+'member/upload/image', 
							filePath: res.tempFilePaths[0],
							name: 'file',
							formData: {
								'token': that.token
							},
							success: (uploadFileRes) => {
								let tempimage=JSON.parse(uploadFileRes.data)
								that.src = tempimage.data.url//图片上传以后 临时替换个人资料中的图片
							}
						});
					},
					fail:function(res) {
						console.log("选择失败了",res)
					}
				});
			},
			cancel(e){
				//地址选择取消按钮
				console.log("cancle",e,this.address)
			},
			confirm(e){
				//地址选择确定按钮
				this.address = e.province.label + e.city.label+e.area.label
				this.address1 = e.province.value +","+ e.city.value+","+e.area.value
			},
			selAddress(){
				this.show_address = true
			},
			updataInfo(){
				let that = this
				this.myRequest({
					url:"member/user/update_user_info",
					method:"POST",
					data:{
						token:that.token,
						realname:that.username,
						avatar:that.src,
						address:that.usertype == "1"||that.usertype == "2"?[that.address,that.address1]:"",
						shop_name:that.usertype == "2"?that.shopname:"",
						
					}
				}).then(res=>{
					if(res.data.code == 1 && res.data.msg == "用户资料更新成功"){
						uni.navigateBack({
							delta: 1,
							success:function(res){
								console.log(res)
							}
						})
					}
				})
			},
			getShowStatus(Val){
			//弹窗状态发生变化通知父组件
				this.isshow = Val
			},
			watchAgreement(val){
				switch(val){
					case 0:
						uni.navigateTo({
							url:"../user_agreement/user_agreement"
						})
						break;
					case 1:
						uni.navigateTo({
							url:"../user_policy/user_policy"
						})
						break;
					case 2:
						this.isshow = true
						break;
					default:
						break;
				}
			
			},
			reserve(){
				this.updataInfo()
			}
		}
	}
</script>

<style lang="stylus" scoped>
.personal
	overflow auto
	.per-info
		.item1
			background-color #FFFFFF
			.item1-contain
				padding 33rpx 0
				font-size 30rpx
				margin-left 25rpx
				font-family Microsoft YaHei
				font-weight Regular
				color #333333
				.left
					width 235rpx
					display inline-block
					vertical-align top
				.right
					width 475rpx
					display inline-block
					text-align right
					position relative
					.image
						width 130rpx
						height 130rpx
						float right
						border-radius 50%
						overflow hidden
						background-color #EBEBEB
						margin-right 50rpx
					.icon
						position absolute
						vertical-align top
						color #999999
						top 50rpx
						right 0rpx
					.icon1
						color #999999
		.per-img
			margin-top 20rpx
			margin-bottom 20rpx
			background-color #FFFFFF
			.left
				line-height 130rpx
		.item2
			background-color #FFFFFF
			margin-bottom 20rpx
			& >>> .u-field
				font-size 30rpx
				font-family Microsoft YaHei
				font-weight Regular
				color #333333
		.options
			background-color #FFFFFF
			border-bottom 1rpx solid #F6F7F9
			&:nth-child(3)
				border-bottom none
	.reserve
		width 619rpx
		height 80rpx
		line-height 80rpx
		margin 51rpx auto 0
		font-family Microsoft YaHei
		font-weight Regular
		font-size 34rpx
		letter-spacing 10rpx
</style>
