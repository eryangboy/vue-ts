import request from "@/utils/request";


// 获取课程列表
export const getQueryCourses = (data: any) => {
    return request({
        method: "post",
        url: "/boss/course/getQueryCourses",
        data
    });
}

// 课程上下架
export const changeState = (params: any) => {
    return request({
        method: "get",
        url: "/boss/course/changeState",
        params
    });
}

// 保存或者更新课程信息
export const saveOrUpdateCourse = (data: any) => {
    return request({
        method: "post",
        url: "/boss/course/saveOrUpdateCourse",
        data
    });
}

// 上传图片
export const uploadCourseImage = (data: any, onUploadProgress?: (progressEvent: any) => void) => {
    return request({
        method: "post",
        url: "/boss/course/upload",
        data,
        onUploadProgress
    });
}

// 获取课程信息
export const getCourseById = (courseId: string | number) => {
    return request({
        method: "get",
        url: "/boss/course/getCourseById",
        params: {
            courseId
        }
    });
}