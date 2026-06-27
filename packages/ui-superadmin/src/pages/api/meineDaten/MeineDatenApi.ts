import * as runtime from "../runtime";
import { ErrorResult, SuccessResult } from "../runtimeType";

class _MaineDatenApi extends runtime.BaseAPI {
    constructor() {
        super();
    }

    // Privacy policy 
    async addBottomText(
        requestParameters: any,
    ): Promise<SuccessResult<any> | ErrorResult> {
        const response = await this.request({
            url: "v1/super-admin/meine-daten-content",
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
    }

    async getBottomText(): Promise<SuccessResult<any> | ErrorResult> {
        const response = await this.request({
            url: "v1/super-admin/get-meine-daten",
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
}
export const MeineDatenApi = new _MaineDatenApi();