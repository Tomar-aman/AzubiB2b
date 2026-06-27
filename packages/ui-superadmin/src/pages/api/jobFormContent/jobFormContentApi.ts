import * as runtime from "../runtime";
import { ErrorResult, SuccessResult } from "../runtimeType";

class _JobFormContentApi extends runtime.BaseAPI {
    constructor() {
        super();
    };

    async addContent(
        requestParameters: any,
    ): Promise<SuccessResult<any> | ErrorResult> {
        const response = await this.request({
            url: "v1/super-admin/job-form-content",
            method: "PUT",
            data: requestParameters
        })
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

    async getContent(): Promise<SuccessResult<any> | ErrorResult> {
        const response = await this.request({
            url: "v1/super-admin/get-job-form-content",
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
    }
};

export const JobFormContentApi = new _JobFormContentApi();