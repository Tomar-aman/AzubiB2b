import * as runtime from "../runtime";
import { ErrorResult, SuccessResult } from "../runtimeType";

class _ApplicationApi extends runtime.BaseAPI {
  constructor() {
    super();
  }

  async getAllApplications(searchValue: string) {
    const response = await this.request({
      url: "v1/admin/all-applications",
      method: "GET",
      params: {
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
  }

  async deleteApplication(
    id: string,
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `v1/admin/application/${id}`,
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

  async getApplicationData(
    id: string,
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `v1/admin/applications/${id}`,
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

  async updateApplicationData(
    id: string,
    data: FormData,
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `v1/admin/application/${id}`,
      method: "PUT",
      data,
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

export const ApplicationApi = new _ApplicationApi();
