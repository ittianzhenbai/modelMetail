// 单独配置url地址，便于以后维护
let BASE_URL  = ""
if(process.env.NODE_ENV === 'development'){
    // 开发环境
    BASE_URL = 'http://syjn.nzsoso.com/'
}else{
    // 生产环境
    BASE_URL = 'http://syjn.nzsoso.com/'
}
// 暴露一个方法，用uni.request发送请求，异步处理的封装最好用promise
const myRequest = (options)=>{
	// resolve（成功之后的回调函数）和reject（失败之后的回调函数）
	return new Promise((resolve,reject)=>{
		// 使用uni.request发送请求
		uni.request({
			// 拼接请求地址
			url:BASE_URL+options.url,
			// 请求方式
			method: options.method || 'GET',
			// 数据
			data: options.data || {},
			// 请求成功
			success: (res) => {
				// 判断请求数据是否成功
				// console.log(res)
				// if(res.data.status !== 0) {
				// 	return uni.showToast({
				// 		title: '获取数据失败!'
				// 	})
				// }
				resolve(res)//resolve修改promise的状态为成功状态
			},
			// 请求失败
			fail: (err) => {
				uni.showToast({
					title: '请求接口失败!'
				})
				reject(err)
			}
		})
	})
}

export {BASE_URL,myRequest}