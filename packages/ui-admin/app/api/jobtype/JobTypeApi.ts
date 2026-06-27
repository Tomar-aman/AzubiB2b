import * as runtime from "../runtime";
import { ErrorResult, SuccessResult } from "../runtimeType";
import { CreateJobTypeRequestDto, JobType } from "./CreateJobTypeReqResDto";

class _JobTypeApi extends runtime.BaseAPI {
  constructor() {
    super();
  }

  async addJobType(
    requestParameters: CreateJobTypeRequestDto,
  ): Promise<SuccessResult<JobType> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/job-type",
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

  async getAllJobTypes(
    pageNo: number,
    recordPerPage: number,
    searchValue: string,
    companyId?: any,
  ) {
    const response = await this.request({
      url: "v1/admin/all-job-types",
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

  async getJobType(id: string): Promise<SuccessResult<JobType> | ErrorResult> {
    const response = await this.request({
      url: `v1/admin/job-type/${id}`,
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

  async updateJobType(
    id: string,
    payload: Partial<{
      jobTypeName: string;
    }>,
  ): Promise<SuccessResult<JobType> | ErrorResult> {
    const response = await this.request({
      url: `v1/admin/job-type/${id}`,
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

  async deleteJobType(
    id: string,
  ): Promise<SuccessResult<JobType> | ErrorResult> {
    const response = await this.request({
      url: `v1/admin/job-type/${id}`,
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

export const JobTypeApi = new _JobTypeApi();
