import Vue from 'vue'
import App from './App'
import store from './vuex/index.js'
import {myRequest,BASE_URL} from './util/api.js'
import uView from "uview-ui";
Vue.use(uView);
//把vuex定义成全局组件
Vue.prototype.$store = store
Vue.prototype.myRequest = myRequest
Vue.prototype.url = BASE_URL
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
