<template>
	<view class="page">
		<text class="title">石原金牛小程序</text>
		<view class="sel-option">
			<view :class="[cur_index == '1'?'option active':'option']" @click="selOption('1')">
				农户
			</view>
			<view :class="[cur_index == '2'?'option active':'option']" @click="selOption('2')">
				零售商
			</view>
		</view>
		<view class="input-box" v-if="cur_index == '1'">
			<view class="text0">
				用户名
			</view>
			<input 
				class="input"
				type="text" 
				placeholder-style="color:#C0C4CD"
				value="" 
				placeholder="请输入用户名"
				maxlength="10"
				v-model="name"
			/>
			<view class="text0">
				地址
			</view>
			<view :class="[address == '请选择地址'?'input sel-address':'input']" @click="selAddress()">
				<text>{{address}}</text>
				<u-picker 
					mode="region" 
					v-model="show" 
					:area-code='["33", "3301", "330108"]' 
					@cancel="cancel()"
					@confirm="confirm()"
					:params="params"></u-picker>
			</view>
		</view>
		<view class="input-box" v-if="cur_index == '2'">
			<view class="text0">
				用户名
			</view>
			<input
				class="input"
				type="text" 
				placeholder-style="color:#C0C4CD"
				value="" 
				placeholder="请输入用户名"
				maxlength="10"
				v-model="name"
			/>
			<view class="text0">
				地址
			</view>
			<view :class="[address == '请选择地址'?'input sel-address':'input']" @click="selAddress()">
				<text>{{address}}</text>
				<u-picker 
					mode="region" 
					v-model="show" 
					:area-code='["33", "3301", "330108"]' 
					@cancel="cancel()"
					@confirm="confirm()"
					:params="params"></u-picker>
			</view>
			<view class="text0">
				店铺名
			</view>
			<input
				class="input shopname"
				placeholder-style="color:#C0C4CD;font-size:28rpx"
				type="text" 
				value="" 
				maxlength="10"
				placeholder="店铺名"
				v-model="shopname"
			/>
		</view>
		<button
			:class="[isactive == false?'regesiter-btn':'regesiter-btn active-btn']" 
			@click="regesiter()" 
			type="default">立即注册</button>
		<u-checkbox
			class="check-box"
			v-model="isChecked"
			shape="circle"
			active-color = "#1AA93A"
		>
		<view class="policy">点击用户同意石原金牛
			<text class="text1" @click="watchAgreement('1')">用户协议</text>以及
			<text class="text1" @click="watchAgreement('2')">隐私政策</text>
		</view>
		</u-checkbox>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				cur_index:"1",
				avatar:"",//用户头像
				name: '',
				shopname:'',
				show:false,
				address:'请选择地址',
				address0:"",//上传的格式为（eg：浙江省杭州市滨江区）
				address1:"",//上传的格式为（eg：33,3301,330101）
				isChecked:false,
				params:{
					province: true,
					city: true,
					area: true
				}
			};
		},
		onShow() {
			let info = JSON.parse(this.wxinfo)
			this.avatar = info.avatarUrl
		},
		computed:{
			...mapState(["token","usertype","wxinfo"]),
			isactive:function(){
				if(this.cur_index == "1"){
					if(this.isChecked == true &&this.name !==''&&this.address !== "请选择地址"){
						return true
					}else{
						return false
					}
				}else if(this.cur_index == "2"){
					if(this.isChecked == true &&this.name !==''&&this.address !== "请选择地址"&&this.shopname !== ''){
						return true
					}else{
						return false
					}
				}else{
					return false
				}
			}
		},
		methods:{
			...mapMutations(["setUsertype","setToken"]),
			selOption(val){
				this.cur_index = val
			},
			selAddress(){
				this.show = true
				console.log(this.show,this.icon_name)
			},
			cancel(e){
				console.log("cancle",e,this.address)
			},
			confirm(e){
				this.address = e.province.label + e.city.label+e.area.label
				this.address0 = e.province.label + e.city.label+ e.area.label
				this.address1 = e.province.value + ','+ e.city.value+','+e.area.value
			},
			watchAgreement(val){
				if(val == "1"){
					uni.navigateTo({
						url:"../user_agreement/user_agreement"
					})
				}else{
					uni.navigateTo({
						url:"../user_policy/user_policy"
					})
				}	
			},
			updateInfo(cur_index){
				let that = this
				this.myRequest({
					url:"member/user/update_user_info",
					method:"POST",
					data:{
						token:that.token,
						user_type:cur_index,
						realname:that.name,
						address:[that.address0,that.address1],
						shop_name:cur_index == "1"?"":that.shopname,
						avatar:that.avatar
					}
				}).then(res=>{
					console.log(res)
					that.setUsertype(res.data.data.user_type)
					that.setToken(res.data.data.token)
					if(cur_index == "1"){
						uni.navigateTo({
							url:"../nonghu_index/nonghu_index"
						})
					}else if(cur_index == "2"){
						uni.navigateTo({
							url:"../retailer_index/retailer_index"
						})
					}
					
				})
			},
			regesiter(){
				if(this.isactive == false){
					console.log("现在被禁用了，什么也不能做")
				}else{
					switch (this.cur_index){
						case "1":
							this.updateInfo(this.cur_index)
							break;
						case "2":
							this.updateInfo(this.cur_index)
							break;
						default:
							console.log("此处有错误")
							break;
					}
				}
				
			},
		}
	}
</script>

<style lang="stylus" scoped>
.page
	overflow auto
	.title
		font-size 40rpx
		font-family Microsoft YaHei
		font-weight bold
		display block
		text-align center
		margin-top 100rpx
		margin-bottom 60rpx
	.sel-option
		display flex
		margin 0 65rpx
		.option
			flex 1
			width 310rpx
			font-family Microsoft YaHei
			font-weight Regular
			text-align center
			line-height 60rpx
			font-size 34rpx
		.active
			border-bottom 4rpx solid #1AA93A
			color #1AA93A
	.input-box
		margin 80rpx 65rpx 52rpx
		.text0
			margin-bottom 20rpx
			font-family Microsoft YaHei
			font-weight Regular
			color #666666
			font-size 34rpx
		.input
			height 80rpx
			line-height 80rpx
			border-radius 7rpx
			padding 0 20rpx
			margin-bottom 30rpx
			font-family Microsoft YaHei
			font-weight Regular
			background-color #FFFFFF
			color #333333
			font-size 28rpx
		.sel-address
			// position relative
			color #C0C4CD
			.address
				width 80%
			.icon
				position absolute
				right 20rpx
				top 30rpx
	.check-box
		border-radius 50%!important
		margin-left 10%
	.policy
		font-size 24rpx
		.text1
			color #EA5413
	.regesiter-btn
		width 619rpx
		margin-top 51rpx
		margin-left 66rpx
		margin-bottom 29rpx
		letter-spacing 10rpx
		font-family Microsoft YaHei
		font-weight Regular
		font-size 34rpx
		border-radius 7rpx
		height 80rpx
		line-height 80rpx
		background-color #BCBCBC
		color #FFFFFF
		&::after
			border none
			outline none
	.active-btn
		background-color #1AA93A
</style>
