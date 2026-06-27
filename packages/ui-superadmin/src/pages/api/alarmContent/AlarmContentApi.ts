import * as runtime from "../runtime";
import { ErrorResult, SuccessResult } from "../runtimeType";

class _JobAlarmContentApi extends runtime.BaseAPI {
    constructor() {
        super();
    };

    async addContent(
        requestParameters: any,
    ): Promise<SuccessResult<any> | ErrorResult> {
        const response = await this.request({
            url: "v1/super-admin/job-alarm-content",
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
            url: "v1/super-admin/get-job-alarm-content",
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

export const JobAlarmContentApi = new _JobAlarmContentApi();