import * as runtime from "../runtime";
import { ErrorResult, SuccessResult } from "../runtimeType";
import { CreateIndustryRequestDto, Industry } from "./CreateIndustryReqResDto";

class _IndustryApi extends runtime.BaseAPI {
  constructor() {
    super();
  }

  async addIndustry(
    requestParameters: CreateIndustryRequestDto,
  ): Promise<SuccessResult<Industry> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/industry",
      method: "POST",
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

  async getAllIndustries(
    pageNo: number,
    recordPerPage: number,
    searchValue: string,
    companyId?: any,
  ) {
    const response = await this.request({
      url: "v1/admin/all-industries",
      method: "GET",
      params: {
        pageNo,
        recordPerPage,
        searchValue,
        companyId,
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

  async getIndustry(
    id: string,
  ): Promise<SuccessResult<Industry> | ErrorResult> {
    const response = await this.request({
      url: `v1/admin/industry/${id}`,
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

  async updateIndustry(
    id: string,
    payload: Partial<{
      industryName: string;
    }>,
  ): Promise<SuccessResult<Industry> | ErrorResult> {
    const response = await this.request({
      url: `v1/admin/industry/${id}`,
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

  async deleteIndustry(
    id: string,
  ): Promise<SuccessResult<Industry> | ErrorResult> {
    const response = await this.request({
      url: `v1/admin/industry/${id}`,
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
}

export const IndustryApi = new _IndustryApi();
