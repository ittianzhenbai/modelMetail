(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/nonghu_manage/nonghu_manage"],{1405:function(e,t,r){},"6e84":function(e,t,r){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=r("2f62");function o(e){return s(e)||u(e)||i(e)||a()}function a(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function i(e,t){if(e){if("string"===typeof e)return c(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?c(e,t):void 0}}function u(e){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}function s(e){if(Array.isArray(e))return c(e)}function c(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function f(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?f(Object(r),!0).forEach((function(t){d(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):f(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function d(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var m=function(){r.e("components/popup").then(function(){return resolve(r("ea50"))}.bind(null,r)).catch(r.oe)},h={data:function(){return{popuptype:"",title:"确定要删除吗？",isshow:!1,placeholder_color:"#999999",farmer_list:[],farmer_id:"",addfarmer:"",status:"loadmore",isloadshow:!1,refreshstatus:!1,page:1,pagesize:10}},computed:l({},(0,n.mapState)(["token"])),components:{Popup:m},onLoad:function(){this.getFarmerList(1,this.pagesize,"")},onPullDownRefresh:function(){this.refreshstatus=!0,this.getFarmerList(1,this.pagesize,"")},methods:{scrollToBottom:function(){this.isloadshow=!0},loadmore:function(){this.status="loading",this.page++,this.getFarmerList(this.page,this.pagesize)},watchNongDetail:function(t){console.log(t),e.navigateTo({url:"../nonghu_detail/nonghu_detail?user_id="+t.farmer_id})},search:function(e){this.getFarmerList(1,this.pagesize,e)},addNonghu:function(){this.title="添加农户",this.popuptype="addpopup",this.isshow=!0},addFarmer:function(){var e=this;this.myRequest({url:"member/farmer/add_farmer",method:"POST",data:{token:e.token,farmer_mobile:e.addfarmer}}).then((function(t){"添加成功"==t.data.msg?(setTimeout((function(){e.isshow=!0,e.title="添加成功",e.popuptype="tongzhi"}),1e3),setTimeout((function(){e.getFarmerList(1,10,"")}),2e3)):setTimeout((function(){e.isshow=!0,e.title=t.data.msg,e.popuptype="tongzhi"}),1e3)}))},getShowStatus:function(e){this.isshow=e},getFarmerList:function(t,r,n){var a=this;this.myRequest({url:"member/farmer/get_farmers",method:"POST",data:{token:a.token,page:t,pagesize:r,keywords:n}}).then((function(r){switch(r.data.code){case 1:var n,i=r.data.data.cur_page.total_count,u=Math.ceil(i/10);if(1==t)a.farmer_list=r.data.data.list;else(n=a.farmer_list).push.apply(n,o(r.data.data.list));a.status=t==u||t>u?"nomore":"loadmore",1==a.refreshstatus&&setTimeout((function(){e.stopPullDownRefresh()}),1e3);break;case 210:a.farmer_list=[];break;default:break}}))},delFarmerList:function(){var e=this;this.myRequest({url:"member/farmer/delete_farmer",method:"POST",data:{token:e.token,farmer_id:e.farmer_id}}).then((function(t){1==t.data.code&&"删除成功"==t.data.msg&&e.getFarmerList(1,e.pagesize,"")}))},deleted:function(e){this.isshow=!0,this.title="确定要删除吗？",this.popuptype="del",this.farmer_id=e.farmer_id},clickItem:function(e){"确定"==e?this.delFarmerList():"增加"==e&&console.log("增加")},getaddValue:function(e){console.log("要增加的用户名是：",e),this.addfarmer=e,this.addFarmer()}}};t.default=h}).call(this,r("543d")["default"])},"946d":function(e,t,r){"use strict";r.d(t,"b",(function(){return o})),r.d(t,"c",(function(){return a})),r.d(t,"a",(function(){return n}));var n={uSearch:function(){return r.e("uview-ui/components/u-search/u-search").then(r.bind(null,"a0b1"))},uImage:function(){return r.e("uview-ui/components/u-image/u-image").then(r.bind(null,"c642"))},uLoadmore:function(){return r.e("uview-ui/components/u-loadmore/u-loadmore").then(r.bind(null,"b340"))}},o=function(){var e=this,t=e.$createElement;e._self._c},a=[]},9929:function(e,t,r){"use strict";(function(e){r("7eb7");n(r("66fd"));var t=n(r("e3b7"));function n(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,r("543d")["createPage"])},bd58:function(e,t,r){"use strict";r.r(t);var n=r("6e84"),o=r.n(n);for(var a in n)"default"!==a&&function(e){r.d(t,e,(function(){return n[e]}))}(a);t["default"]=o.a},c49a:function(e,t,r){"use strict";var n=r("1405"),o=r.n(n);o.a},e3b7:function(e,t,r){"use strict";r.r(t);var n=r("946d"),o=r("bd58");for(var a in o)"default"!==a&&function(e){r.d(t,e,(function(){return o[e]}))}(a);r("c49a");var i,u=r("f0c5"),s=Object(u["a"])(o["default"],n["b"],n["c"],!1,null,"a24a2332",null,!1,n["a"],i);t["default"]=s.exports}},[["9929","common/runtime","common/vendor"]]]);