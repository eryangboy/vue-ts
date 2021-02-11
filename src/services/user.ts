import qs from "qs";
import request from "@/utils/request";
import store from '@/store'

interface User {
    phone: string
    password: string
}

// 用户登录
export const login = (data: User) => {
    return request({
        method: "post",
        url: "/front/user/login",
        // headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify(data),
    });
}

// 获取用户信息
export const getUserInfo = () => {
    return request({
        method: "get",
        url: "/front/user/getInfo",
    });
}

// 分页查询用户信息
export const getUserPages = (data: any) => {
    return request({
        method: "post",
        url: "/boss/user/getUserPages",
        data
    });
}