import axios from 'axios'

const instance = axios.create({
  timeout: 10000
})
// 添加请求拦截器
instance.interceptors.request.use(
  (config: any) => {
    // 在发送请求之前做些什么
    const token = '211'
    config.headers.Authorization = token
    return config
  },
  (error: any) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  (response: any) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response
  },
  (error: any) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)
