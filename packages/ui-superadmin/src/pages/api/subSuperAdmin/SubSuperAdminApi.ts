import * as runtime from "../runtime";
import { ErrorResult, SuccessResult } from "../runtimeType";
import { CreateRequestDto, CreateResponseDtoFromJSON, SubSuperAdminType } from "./createReqResDto";

class _SubSuperAdminApi extends runtime.BaseAPI {
    constructor() {
        super();
    };

    async createUser(
        requestParameters: CreateRequestDto
    ): Promise<SuccessResult<SubSuperAdminType> | ErrorResult> {
        const response = await this.request({
            url: "v1/super-admin/auth/create-user",
            method: "POST",
            data: requestParameters,
        });

        if (response.remote === "success") {
            return {
                remote: "success",
                data: {
                    message: response.data.message,
                    status: response.data.status,
                    data: CreateResponseDtoFromJSON(response.data.data),
                },
            };
        }
        return response as ErrorResult;
    };

    async getAllUsers(page: number, recordPerPage: number, search: string) {
        const response = await this.request({
            url: `v1/super-admin/users?role=Sub-SuperAdmin`,
            method: "GET",
            params: {
                page,
                recordPerPage,
                search,
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

    async deleteUserById(
        id: string
    ): Promise<SuccessResult<SubSuperAdminType> | ErrorResult> {
        const response = await this.request({
            url: `/v1/super-admin/delete/${id}`,
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

    async getUserById(
        id: string
    ): Promise<SuccessResult<SubSuperAdminType> | ErrorResult> {
        const response = await this.request({
            url: `v1/super-admin/user/${id}`,
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

    async updateUserById(
        id: string,
        payload: Partial<{
            firstName: string;
            lastName: string;
            email: string;
            oldPassword: string;
            newPassword: string;
        }>
    ): Promise<SuccessResult<SubSuperAdminType> | ErrorResult> {
        const response = await this.request({
            url: `v1/super-admin/user/${id}`,
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
    };
};

export const SubSuperAdminApi = new _SubSuperAdminApi();