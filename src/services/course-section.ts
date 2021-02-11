import request from "@/utils/request";


// 获取课程章节内容
export const getSectionAndLesson = (courseId: number | string) => {
    return request({
        method: "get",
        url: "/boss/course/section/getSectionAndLesson",
        params: {
            courseId
        }
    });
}

// 更新课程章节内容
export const saveOrUpdateSection = (data: any) => {
    return request({
        method: "post",
        url: "/boss/course/section/saveOrUpdateSection",
        data
    });
}

// 更新课时内容
export const saveOrUpdateLesson = (data: any) => {
    return request({
        method: "post",
        url: "/boss/course/lesson/saveOrUpdate",
        data
    });
}

// 获取课程单个章节内容
export const getBySectionId = (sectionId: number | string) => {
    return request({
        method: "get",
        url: "/boss/course/section/getBySectionId",
        params: {
            sectionId
        }
    });
}