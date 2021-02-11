import request from "@/utils/request";


// 查询角色
export const getRolePages = (data: any) => {
    return request({
        method: "post",
        url: "/boss/role/getRolePages",
        data
    });
}

// 添加或更新角色
export const saveOrUpdateRole = (data: any) => {
    return request({
        method: "post",
        url: "/boss/role/saveOrUpdate",
        data
    });
}

// 删除角色
export const deleteRole = (id: number) => {
    return request({
        method: "delete",
        url: `/boss/role/${id}`,
    });
}

// 获取当前角色
export const getCurrentRole = (id: number | string) => {
    return request({
        method: "get",
        url: `/boss/role/${id}`,
    });
}

// 获取当前角色
export const getAllRoles = () => {
    return request({
        method: "get",
        url: '/boss/role/all',
    });
}

// 给用户分配角色
export const allocateUserRoles = (data: any) => {
    return request({
        method: "post",
        url: "/boss/role/allocateUserRoles",
        data
    });
}

// 查询用户角色
export const getCurrentUserRole = (userId: number) => {
    return request({
        method: "get",
        url: `/boss/role/user/${userId}`,
    });
}