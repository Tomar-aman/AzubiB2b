import * as runtime from "../runtime";
import { ErrorResult, SuccessResult } from "../runtimeType";

class _ManagePolicyApi extends runtime.BaseAPI {
    constructor() {
        super();
    }

    async addPrivacyPolicyContent(
        requestParameters: any,
    ): Promise<SuccessResult<any> | ErrorResult> {
        const response = await this.request({
            url: "v1/admin/add-privacy-policy",
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

    async getPrivacyPolicyData(): Promise<SuccessResult<any> | ErrorResult> {
        const response = await this.request({
            url: "v1/admin/get-privacy-policy",
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

export const PrivacyPolicyApi = new _ManagePolicyApi();