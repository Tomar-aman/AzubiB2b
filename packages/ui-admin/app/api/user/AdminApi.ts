import * as runtime from "../runtime";
import { ErrorResult, SuccessResult } from "../runtimeType";
import { AdminResponseDto } from "./AdminResDto";

class _AdminApi extends runtime.BaseAPI {
  constructor() {
    super();
  }

  async getCompanyData(): Promise<
    SuccessResult<AdminResponseDto> | ErrorResult
  > {
    const response = await this.request({
      url: "v1/admin/get-company",
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

  async updateCompanyData(
    payload: Partial<{
      profileIcon: null;
      companyname: string;
      oldPassword: string;
      newPassword: string;
    }>,
  ): Promise<SuccessResult<AdminResponseDto> | ErrorResult> {
    // Validation: Ensure oldPassword is provided if newPassword exists
    if (payload.newPassword && !payload.oldPassword) {
      return {
        remote: "error",
        message: "Old password is required when setting a new password.",
        status: 400,
      } as unknown as ErrorResult;
    }

    const response = await this.request({
      url: "v1/admin/company",
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
}
export const AdminApi = new _AdminApi();
