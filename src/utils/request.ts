import axios from 'axios';
import qs from 'qs'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'

const request = axios.create({})

// 添加请求拦截器
request.interceptors.request.use(config => {
    // 在发送请求之前做些什么
    const { user } = store.state;
    if (user && user.access_token) {
        config.headers.Authorization = user.access_token;
    }

    return config;
}, error => {
    // 对请求错误做些什么
    return Promise.reject(error);
});


const redirectLogin = () => {
    router.push({
        name: 'login',
        query: {
            redirect: router.currentRoute.fullPath
        }
    })
}

const refreshToken = () => {
    return axios.create()({
        method: 'post',
        url: '/front/user/refresh_token',
        data: qs.stringify({
            refreshtoken: store.state.user.refresh_token
        })
    })
}

// 添加响应拦截器
let isRefreshing = false // 控制刷新 token 状态
let requests: any[] = [] // 存储刷新 token 期间过来的 401 请求
request.interceptors.response.use(response => {
    // 状态码为2xx，会进入这里
    // console.log(response)
    return response;
}, async error => {
    // 状态码超出2xx，都会进入这里
    if (error.response) {
        // 请求收到响应，但是状态码超出2xx范围
        const { status } = error.response;
        if (status === 400) {
            Message.error('请求参数错误')
        } else if (status === 401) {
            if (!store.state.user) {
                redirectLogin()
                return Promise.reject(error)
            }

            // 刷新token
            if (!isRefreshing) {
                isRefreshing = true
                return refreshToken().then(res => {
                    if (!res.data.success) {
                        throw new Error('刷新 Token 失败')
                    }
                    // 成功了 -> 把本次失败的请求重新发出去
                    store.commit('setUser', res.data.content)
                    // 把requests队列中的请求重新发出去
                    requests.forEach(cb => cb())
                    // 重置requests数组
                    requests = [];
                    return request(error.config)
                }).catch(error => {
                    // 失败了 -> 跳转登录页面重新获取新的token
                    store.commit('setUser', null)
                    redirectLogin()
                    return Promise.reject(error)
                }).finally(() => {
                    isRefreshing = false // 重置刷新状态
                })
            }

            // 刷新状态下，把请求挂起放到 requests 数组中
            return new Promise(resolve => {
                requests.push(() => {
                    resolve(request(error.config))
                })
            })


        } else if (status === 403) {
            Message.error('没有权限，请联系管理员')
        } else if (status === 404) {
            Message.error('请求资源不存在')
        } else if (status >= 500) {
            Message.error('服务端错误，请联系管理员')
        }
    } else if (error.request) {
        // 请求发出去，没有收到响应
        Message.error('请求超时，请刷新重试')
    } else {
        // 在设置请求时发生了一些事情，触发了一个错误
        Message.error(`请求失败，${error.message}`)
    }

    return Promise.reject(error);
});

export default request;