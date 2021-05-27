<template>
	<view class="login">
		<text class="title">石原金牛小程序</text>
		<view class="input-box">
			<view class="text0">
				手机号
			</view>
			<u-input 
				v-model="iPhoneNumber" 
				type="number" 
				:height="80"
				:maxlength="11"
				:custom-style="inputStyle"
				:placeholder-style="placeholderStyle"
				placeholder="请输入手机号"
				:trim="true"
				/>
			<view class="yanzhengma-box">
				<view class="text0">
					验证码
				</view>
				<view class="input-yanzhengma">
					<u-input
						v-model="yanzhengma" 
						type="number" 
						:height="80"
						:maxlength="4"
						:custom-style="inputStyle"
						:placeholder-style="placeholderStyle"
						placeholder="请输入验证码"
						:trim="true"
						@focus="getfocus"
						/>
				</view>
				<text 
					class="get-yanzhengma" 
					:class="[watching == true?'get-yanzhengma':'get-yanzhengma disable']" 
					@click="getMsginfo()">{{msg}}</text>
			</view>
		</view>
		<u-toast ref="uToast" />
		<button 
			:class="[islimit == true?'login-btn disable':'login-btn ']" 
			type="primary" 
			@click="login()" 
			:disabled="islimit">提 交</button>
		<u-loading size="48" :show="isloading" color="#1aad19"></u-loading>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				isloading:false,//控制加载动画是否开始
				iPhoneNumber:'',//手机号
				yanzhengma:"",//验证码
				msg:'获取验证码',
				times:null,//计时器
				inputStyle:{
					'backgroundColor':'#FFFFFF',
					'wdith':'100%',
					'padding':'0 20rpx',
					'fontSize':'36rpx',
					'fontFamily':'Microsoft YaHei',
					'borderTopLeftRadius':'7rpx',
					'borderBottomLeftRadius':'7rpx'
				},
				placeholderStyle:"color:#C0C4CD;font-family:Microsoft YaHei;font-size:28rpx",
				operation:"",//上页传递的参数进行执行
			};
		},
		onLoad(option) {
			this.operation = option.operation
		},
		onShow(option) {
			if(this.operation == "relogin"){
				//什么也不做 重新登录
				console.log("relogin")
			}else{
				if(this.token&&this.usertype == "1"){
					uni.redirectTo({
						url:"../nonghu_index/nonghu_index"
					})
				}else if(this.token&&this.usertype == "2"){
					uni.redirectTo({
						url:"../retailer_index/retailer_index"
					})
				}else if(this.token&&this.usertype == "3"){
					uni.redirectTo({
						url:"../salesman_index/salesman_index"
					})
				}
			}
		},
		computed:{
			...mapState(["token","usertype"]),
			//业务员测试账号 18806536335 15168363962
			islimit(){
				if(this.isPhoneNumber&&this.yanzhengma.length == 4){
					return false
				}else{
					return true
				}
			},
			watching(){
				// true 控制是否重新开始计时
				if(this.isPhoneNumber&&this.times == null&&this.isPhoneNumber == true){
					return true
				}else{
					return false
				}
			},
			isPhoneNumber() {
			   //验证手机格式是否正确
				let reg = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[0,1,2,3,4,5,6,7,8,9])\d{8}$/;
			    return reg.test(this.iPhoneNumber);
			}
		},
		methods:{
			...mapMutations(["setToken","setUsertype","setWxInfo"]),
			//轻提示
			showToast(title) {
				this.$refs.uToast.show({
					title: title,
					type: 'error',
					icon:false,
					position:'bottom'
				})
			},
			//验证码剪切板复制
			getfocus(){
				let that = this
				uni.getClipboardData({
				    success: function (res) {
						//获取粘贴板上的数字
				        if(res.data.length == 4){
							that.yanzhengma = res.data
						}
				    }
				});
			},
			//调用微信的api获取用户的头像信息
			getUserinfo(){
				//获取用户信息 头像 昵称
				// if(userinfo.detail.errMsg=="getUserInfo:ok"){
				// 	this.setWxInfo(JSON.stringify(userinfo.detail.userInfo))
				// }
				uni.getUserProfile({
					desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: (res) => {
					  if(res.errMsg == "getUserProfile:ok"){
						  this.setWxInfo(JSON.stringify(res.userInfo))
						  this.isloading = true
						  this.loginOperation()
					  }
					},
					fail:(res)=>{
						conso.log("取消了选择")
					}
				})
				// console.log("在登录的时候 获取了用户的信息",userinfo)
			},
			//发送短信接口
			getMsgCode(){
				var that = this
				this.myRequest({
					url:"member/login/sendsms",
					method:"POST",
					data:{
						mobile:that.iPhoneNumber,
					}
				}).then(res=>{
					if(res.data.code == 1){
						console.log("验证码发送成功了")
					}else{
						that.showToast("验证码发送失败，请稍后重试")
					}
					
				})
			},
			//获取信息
			getMsginfo(){
				if(this.watching == true){
					let that = this
					uni.getNetworkType({
					    success: function (res) {
					        console.log(res.networkType);
							if(res.networkType == "none"){
								console.log("当前断网了")
								that.showToast("验证码发送失败，请稍后重试")
							}else{
								that.getMsgCode()
								let timer = 61
								that.times = setInterval(()=>{
									if(timer > 0){
										timer --
										that.msg = timer+"s"
									}else{
										that.msg = "获取验证码"
										clearInterval(that.times)
										that.times = null
									}
								},1000)
							}
					    }
					});
					
				}else{
					console.log("暂时不能操作")
				}
			},
			//调用登录接口
			loginOperation(){
				let that = this
				this.myRequest({
					url:"/member/login/login",
					methods:"post",
					data:{
						mobile:that.iPhoneNumber,
						code:that.yanzhengma
					}
				}).then(res=>{
					let title = ""
					that.isloading = false
					switch(res.data.msg){
						case "手机号不正确":
							title = "手机号格式错误，请重新填写"
							that.showToast(title)
							break;
						case "短信验证码验证失败！":
							title = "验证码错误，请重新填写"
							that.showToast(title)
							break;
						case "已登录":
							that.setToken(res.data.data.token)
							that.setUsertype(res.data.data.user_type)
							console.log(res.data.data.user_type)
							switch(res.data.data.user_type){
								case 0:
									//未注册进入注册页面
									uni.navigateTo({
										url:"../regesiter/regesiter"
									})
									break;
								case 1:
									//农户界面
									uni.redirectTo({
										url:"../nonghu_index/nonghu_index"
									})
									break;
								case 2:
									//零售商界面
									uni.redirectTo({
										url:"../retailer_index/retailer_index"
									})
									break;
								case 3:
									//基础业务员
									uni.redirectTo({
										url:"../salesman_index/salesman_index"
									})
									break;
								case 5:
									//省经理
									uni.redirectTo({
										url:"../salesman_index/salesman_index"
									})
									break;
								case 6:
									//经理
									uni.redirectTo({
										url:"../salesman_index/salesman_index"
									})
									break;
								case 99:
									//高级管理员
									uni.redirectTo({
										url:"../salesman_index/salesman_index"
									})
									break;
								default:
									break;
							}
							break;
						default:
							break;
					}
				})
			},
			//点击登录按钮先获取用户头像 然后再进行登录
			login(){
				//测试验证码默认为1591
				if(this.isloading == false){
					this.getUserinfo()
				}
			},
		},
		watch:{
			iPhoneNumber(newVal){
				if(newVal.length == 11&&this.isPhoneNumber == false){
					let title = "手机号格式错误，请重新填写"
					this.showToast(title)
				}
			}
		}
	}
</script>

<style lang="stylus" scoped>
.login
	overflow auto
	margin 0 auto
	text-align center
	.title
		font-size 40rpx
		font-family Microsoft YaHei
		font-weight bold
		display block
		margin-top 100rpx
		margin-bottom 102rpx
	.input-box
		margin-top 102rpx
		text-align left
		margin 0 64rpx 50rpx 66rpx
		&>>>.u-input__right-icon
			background-color #FFFFFF
			padding-right 20rpx
			border-top-right-radius 7rpx
			border-bottom-right-radius 7rpx
		.text0
			margin-bottom 20rpx
			font-family Microsoft YaHei
			font-weight Regular
			color #666666
			font-size 34rpx
		.yanzhengma-box
			display block
			margin-top 39rpx
			.input-yanzhengma
				width 425rpx
				display inline-block
				&>>>.u-input__right-icon
					background-color #FFFFFF
					padding-right 20rpx
					border-top-right-radius 7rpx
					border-bottom-right-radius 7rpx
			.get-yanzhengma
				width 166rpx
				display inline-block
				text-align center
				vertical-align top
				margin-left 28rpx
				line-height 80rpx
				background #1AA93A
				color #FFFFFF
				font-size 28rpx
				font-family Microsoft YaHei
				font-weight 400
				border-radius 6rpx
				.disable
					background-color #BCBCBC
					color #FFFFFF
	.login-btn
		margin 50rpx auto
		width 619rpx
		height 80rpx
		line-height 80rpx
		&::after
			border none
			outline none
	.disable
		background-color #BCBCBC!important
		color #FFFFFF
</style>
