import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
		token:uni.getStorageSync('token')?uni.getStorageSync('token'):'',
		usertype:uni.getStorageSync('usertype')?uni.getStorageSync('usertype'):'',//用户类型 1农民 2零售商
		wxinfo:uni.getStorageSync('wxinfo')?uni.getStorageSync('wxinfo'):'',//微信头像 昵称
		userinfo:uni.getStorageSync('userinfo')?uni.getStorageSync('userinfo'):'',//用户注册时候的信息
	},
    mutations: {
		setToken(state,data){
			//更新token的值
			state.token = data
			// console.log("Vuex",state.token)
			try {
				uni.setStorageSync('token', data);
			} catch (e) {
				console.log(e)
			}
		},
		setUsertype(state,data){
			//用户类型
			state.usertype = data
			try {
				uni.setStorageSync('usertype', data);
			} catch (e) {
				console.log(e)
			}
		},
		setUserInfo(state,data){
			state.userinfo = data
			try {
				uni.setStorageSync('userinfo', data);
			} catch (e) {
				console.log(e)
			}
		},
		setWxInfo(state,data){
			state.wxinfo = data
			try {
				uni.setStorageSync('wxinfo', data);
			} catch (e) {
				console.log(e)
			}
		}
	},
    actions: {}
})
export default store