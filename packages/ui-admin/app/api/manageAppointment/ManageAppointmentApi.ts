import * as runtime from "../runtime";
import { ErrorResult, SuccessResult } from "../runtimeType";

class _ManageAppointmentApi extends runtime.BaseAPI {
    constructor() {
        super();
    }

    async addAppointmentContent(
        requestParameters: any,
    ): Promise<SuccessResult<any> | ErrorResult> {
        const response = await this.request({
            url: "v1/admin/appointment-content",
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

    async getAppointmentData(): Promise<SuccessResult<any> | ErrorResult> {
        const response = await this.request({
            url: "v1/admin/get-appointment-content",
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

export const AppointmentApi = new _ManageAppointmentApi();