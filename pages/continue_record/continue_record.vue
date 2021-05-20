<template>
	<view class="add-record">
		<view class="add-label">
			<u-field
				v-model="prescription"
				label="用药配方"
				:maxlength="50"
				placeholder="请输入用药配方"
				:field-style = "fieldstyle"
				:placeholder-style="placehold_style"
				type="textarea"
			>
			</u-field>
			<u-field
				v-model="effect"
				label="用药效果"
				placeholder="请选择上次用药效果"
				 @click="showAction" 
				:disabled="true" 
				:right-icon="right_icon"
				:field-style = "fieldstyle"
				:placeholder-style="placehold_style"
			>
			</u-field>
			<u-action-sheet 
				@click="clickItem" 
				:list="effectList" 
				:cancel-btn="false"
				:border-radius="17"
				v-model="show"></u-action-sheet>
		</view>
		<view class="upload-photo">
			<view class="upload-left">
				<text class="text1">拍照上传</text>
				<text class="text1">请上传2-5张</text>
			</view>
			<view class="upload-right">
				<u-upload
					:action="action" 
					:source-type = "sourceType"
					:custom-btn="true"
					:width="width"
					:height="height"
					:max-count="maxcount"
					:deletable="true"
					:size-type="size_type"
					ref="uUpload"
					:auto-upload="false"
					:formData="formData"
					@on-remove="removeUpload"
					@on-choose-complete="chooseUpload"
					@on-success="uploadsuccess"
					>
					<view slot="addBtn" class="slot-btn" hover-class="slot-btn__hover" hover-stay-time="150">
						<u-icon name="camera" size="60" :color="color"></u-icon>
					</view>
				</u-upload>
			</view>
		</view>
		<button 
			:class="[isactive == false?'submit':'submit active']" 
			@click="submit()" 
			type="default">提交</button>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				prescription:'',//所用药物
				effect:"",//用药效果
				width:"150",//图片上传组件显示的宽度
				height:'150',//图片上传组件显示的高度
				maxcount:'5',//图片上传的最大数量
				show:false,//控制用药效果选择action
				right_icon:"arrow-right",//选择效果的箭头
				size_type:['original', 'compressed'],//选择图片类型是原图还是压缩
				effectList: [
					{
						text: '好',
					},
					{
						text: '一般'
					},
					{
						text: '差'
					}
				],
				fieldstyle:{
					'fontSize':'30rpx',
					'color':'#333333',
					'paddingLeft':'30rpx'
				},
				placehold_style:"color:#999999;font-size:30rpx;font-family: Microsoft YaHei;font-weight: Regular;",
				fileList: [],//上传的图片列表
				sourceType:['camera'],//可以选择的类型
				color:"#999999",//相机字体图标的颜色
				crop_code:""//药物跟踪记录编码
			};
		},
		computed:{
			...mapState(["token"]),
			action(){
				//配置图片上传的地址
				return this.url + "member/upload/image_multi"
			},
			formData(){
				//注意这里的token在真机调试是无法获取到的 因为本地存储没有存储在手机上
				//配置图片上传时需要携带的参数
				return {
					token:this.token,
					file:this.fileList
				}
			},
			length(){
				return this.fileList.length
			},
			isactive(){
				if(this.effect !==''&&this.prescription !== ""&&this.length >= 2){
					return true
				}else{
					return false
				}
			}
		},
		onLoad(option) {
			this.crop_code = option.crop_code
		},
		methods:{
			chooseUpload(lists,name){
				//选择上传的图片列表
				this.fileList = lists
			},
			removeUpload(index,lists,name){
				this.fileList = lists
			},
			addContinueRecord(imageUrl){
				let that = this
				this.myRequest({
					url:"member/crop/add_crop_track",
					method:"POST",
					data:{
						token:that.token,
						crop_code:that.crop_code,
						crop_effect:that.effect,
						crop_recipel:that.prescription,
						crop_img:imageUrl
					}
				}).then(res=>{
					if(res.data.code == 1 &&res.data.msg == "添加用药跟踪记录成功"){
						uni.navigateTo({
							url:`../medication_record_detail/medication_record_detail?crop_code=${this.crop_code}`
						})
					}
				})
			},
			submit(){
				if(this.isactive == true){
					this.$refs.uUpload.upload();
				}else{
					console.log("现在按钮被禁用了")
				}
			},
			showAction() {
				this.show = true;
				this.right_icon = "arrow-down"
			},
			clickItem(index) {
				this.effect = this.effectList[index].text;
			},
			uploadsuccess(data, index, lists, name){
				//图片上传成功前的钩子
				let files = []
				files = lists.filter(val => {
					//通过filter，筛选出上传进度为100的文件(因为某些上传失败的文件，进度值不为100，这个是可选的操作)
							return val.progress == 100;
						})
				let imageUrl = files.reduce(function(arr,singlefile){
					arr.push(singlefile.response.data[0].url)
					return arr
				},[])
				if(this.fileList.length == files.length){
					//如果上传成功的图片 和 选择的图片数量一致表示已经全部上传成功了
					console.log("点击上传以后的数据：",files,imageUrl)
					this.addContinueRecord(imageUrl)
				}
			},
		},
		watch:{
			show(newVal){
				if(newVal == false){
					this.right_icon = "arrow-right"
				}else{
					this.right_icon = "arrow-down"
				}
			}
		}
	}
</script>

<style lang="stylus" scoped>
page
	background-color #EFEFF4
.add-record
	overflow auto
	.add-label
		margin-top 20rpx
		font-size 30rpx
		background-color #FFFFFF
		& >>> .u-label-text
			font-size 30rpx
			font-family Microsoft YaHei
			font-weight Regular
			color #333333
	.add-label >>> .u-action-sheet-item
		border-radius 20rpx!important
	.upload-photo
		margin-top 20rpx
		width 100%
		display flex
		background-color #FFFFFF
		.upload-left
			flex 185rpx
			padding-top 31rpx
			padding-left 25rpx
			.text1
				display block
				text-align left
				font-family Microsoft YaHei
				font-weight Regular
				color #333333
				font-size 30rpx
				&:nth-child(2)
					font-size 22rpx
					color #999999
					margin-top 18rpx
		.upload-right
			flex 565rpx
			.slot-btn
				width 150rpx
				height 150rpx
				display flex
				justify-content center
				margin 10rpx
				align-items center
				background rgb(244, 245, 246)
				border-radius 10rpx
			.slot-btn__hover 
				background-color rgb(235, 236, 238)
	.submit
		width 619rpx
		margin-top 51rpx
		margin-left 66rpx
		letter-spacing 10rpx
		font-family Microsoft YaHei
		font-weight Regular
		font-size 34rpx
		border-radius 7rpx
		height 80rpx
		line-height 80rpx
		background-color #BCBCBC
		color #FFFFFF
	.active
		background-color #1AA93A
			
</style>
