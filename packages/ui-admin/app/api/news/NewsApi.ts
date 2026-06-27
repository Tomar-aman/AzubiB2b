import * as runtime from "../runtime";
import { ErrorResult, SuccessResult } from "../runtimeType";
import { News, UpdateNews } from "./CreateNewsReqResDto";

class _NewsAPI extends runtime.BaseAPI {
    constructor() {
        super();
    }

    async addNews(
        requestParameters: any,
    ): Promise<SuccessResult<any> | ErrorResult> {
        const response = await this.request({
            url: "v1/admin/add-news",
            method: "PUT",
            data: requestParameters,
        });
        if (response.remote === "success") {
            return {
                remote: "success",
                data: {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                },
            };
        }
        return response as ErrorResult;
    };

    async getNewsData(id: string): Promise<SuccessResult<any> | ErrorResult> {
        const response = await this.request({
            url: `v1/admin/get-news-detail/${id}`,
            method: "GET",
        });
        if (response.remote === "success") {
            return {
                remote: "success",
                data: {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                },
            };
        }
        return response as ErrorResult;
    };

    async getAllNews(
        pageNo: number,
        recordPerPage: number,
        searchValue: string,
    ) {
        const response = await this.request({
            url: "v1/admin/all-news",
            method: "GET",
            params: {
                pageNo,
                recordPerPage,
                searchValue,
            },
        });
        if (response.remote === "success") {
            return {
                remote: "success",
                data: {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                },
            };
        }
        return response;
    };

    async deleteNews(
        id: string,
    ): Promise<SuccessResult<News> | ErrorResult> {
        const response = await this.request({
            url: `v1/admin/news/${id}`,
            method: "DELETE",
        });
        if (response.remote === "success") {
            return {
                remote: "success",
                data: {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                },
            };
        }
        return response as ErrorResult;
    }

    async updateNews(
        id: string,
        payload: Partial<UpdateNews>,
    ): Promise<SuccessResult<any> | ErrorResult> {
        const response = await this.request({
            url: `v1/admin/news/${id}`,
            method: "PUT",
            data: payload,
        });
        if (response.remote === "success") {
            return {
                remote: "success",
                data: {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                },
            };
        }
        return response as ErrorResult;
    }

    async deleteNewsImages(id: string, fileUrl: string): Promise<SuccessResult<any> | ErrorResult> {
        const response = await this.request({
            url: `v1/admin/delete-news-images/${id}?fileUrl=${fileUrl}`,
            method: "DELETE",
        });
        if (response.remote === "success") {
            return {
                remote: "success",
                data: {
                    message: response.data.message,
                    status: response.data.status,
                    data: response.data.data,
                },
            };
        }
        return response as ErrorResult;
    };
};

export const NewsApi = new _NewsAPI();