<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	page{
		background-color: #EFEFF4;
		height: 100%;
		button::after{
			border:none;
			outline:none;
		}
	}
	@import "uview-ui/index.scss";
</style>
