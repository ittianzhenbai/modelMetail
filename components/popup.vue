<template>
	<view class="popup-page">
		<u-popup
			v-model="popupshow"
			 class="popup"
			:with="600"
			:height="height"
			:closeable="false"
			:mask="true"
			mode="center" 
			border-radius="8">
			<view class="popup-contain">
				<view v-if="puptype=='addpopup'" class="add-text">
					<view class="title">
						{{title}}
					</view>
					<view class="input-box">
						<u-input 
							v-model="addvalue" 
							:type="type"
							placeholder="请输入手机号"
							:height="inputheight"
							:border="border" 
							/>
					</view>
				</view>
				<view  v-else class="popup-text">
					{{title}}
				</view>
				<view v-if="puptype=='tongzhi'" class="btns">
					<text class="btn1" @click="btnclick('我知道了')" >我知道了</text>
				</view>
				<view v-else-if="puptype=='addpopup'" class="btns">
					<text class="btn" @click="btnclick('取消')">取消</text>
					<text class="btn" @click="btnclick('增加')" >确定</text>
				</view>
				<view v-else class="btns">
					<text class="btn" @click="btnclick('取消')">取消</text>
					<text class="btn" @click="btnclick('确定')" >确定</text>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name:"popup",
		props:{
			title:{
				type:String,
				default:''
			},
			isshow:{
				type:Boolean,
				default:false
			},
			popuptype:{
				type:String,
				default:''
			}
		},
		data() {
			return {
				popupshow:false,//退出登录弹窗
				addvalue:"",
				puptype:"",//弹窗类型
				type: 'text',
				border: false,
				height:300,
				inputheight:"80"
			};
		},
		methods:{
			btnclick(item){
				this.$emit("clickItem",item)
				if(item == "取消"){
					this.popupshow = false
				}else if(item == "确定"){
					this.popupshow = false
				}else if(item == "我知道了"){
					this.popupshow = false
				}else if(item == "增加"){
					this.popupshow = false
					if(this.popuptype == 'addpopup'){
						this.$emit("getaddValue",this.addvalue)
					}
				}
			},
		},
		watch:{
			popupshow(newVal){
				this.$emit("getShowStatus",newVal)
			},
			isshow(newVal){
				this.popupshow = newVal
			},
			popuptype(newVal){
				this.puptype = newVal
				if(newVal == 'addpopup'){
					this.height = 370
					//每次添加要重新初始化
					this.addvalue = ""
				}else{
					this.height = 300
				}
			}
		}
	}
</script>

<style lang="stylus" scoped>
.popup-page
	.popup
		.popup-contain
			font-size 32rpx
			font-family Microsoft YaHei
			font-family Regular
			color #353535
			width 600rpx
			.popup-text
				height 196rpx
				line-height 196rpx
				text-align center
				border-bottom 1rpx solid #E5E5E5
			.add-text
				text-align center
				border-bottom 1rpx solid #E5E5E5
				.title
					padding-top 51rpx
					padding-bottom 44rpx
				.input-box
					margin 0 50rpx 49rpx
					border-bottom 1rpx solid rgba(0,0,0,0.1)
			.btns
				height 103rpx
				line-height 103rpx
				display flex
				.btn
					flex 1
					display inline-block
					border-right 1rpx solid #E5E5E5
					text-align center
					&:nth-child(2)
						color #1AA93A
				.btn1
					color #1AA93A
					display block
					width 100%
					text-align center
	
</style>
