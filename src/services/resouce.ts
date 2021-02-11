import request from "@/utils/request";

// 获取资源列表
export const getResourcePages = (data: any) => {
    return request({
        method: "post",
        url: '/boss/resource/getResourcePages',
        data
    });
}

// 获取资源
export const getResource = (id: number) => {
    return request({
        method: "get",
        url: `/boss/resource/${id}`,
    });
}

// 添加/编辑资源
export const saveOrUpdateResource = (data: any) => {
    return request({
        method: "post",
        url: '/boss/resource/saveOrUpdate',
        data
    });
}

// 删除资源
export const deleteResource = (id: number) => {
    return request({
        method: "delete",
        url: `/boss/resource/${id}`,
    });
}

// 获取资源分类
export const getResourceCategories = () => {
    return request({
        method: "get",
        url: '/boss/resource/category/getAll',
    });
}

// 删除资源分类
export const deleteResourceCategorie = (id: number) => {
    return request({
        method: "delete",
        url: `/boss/resource/category/${id}`,
    });
}

// 添加/编辑资源分类
export const saveOrUpdateResourceCategory = (data: any) => {
    return request({
        method: "post",
        url: '/boss/resource/category/saveOrderUpdate',
        data
    });
}

// 按角色分配资源
export const allocateRoleResources = (data: any) => {
    return request({
        method: 'post',
        url: '/boss/resource/allocateRoleResources',
        data
    })
}

// 获取角色拥有的资源列表
export const getRoleResources = (roleId: string | number) => {
    return request({
        method: 'get',
        url: '/boss/resource/getRoleResources',
        params: {
            roleId
        }
    })
}