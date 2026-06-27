import * as runtime from "../runtime";
import { ErrorResult, SuccessResult } from "../runtimeType";
import { UpdateJob } from "./CreateJobReqResDto";

class _JobApi extends runtime.BaseAPI {
  constructor() {
    super();
  }

  async addJobs(
    requestParameters: any,
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/add-job",
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

  async updateJob(
    id: string,
    payload: Partial<UpdateJob>,
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `v1/admin/job/${id}`,
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

  async updateStatus(id: string): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `v1/super-admin/job-status/${id}`,
      method: "PUT",
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

  async getAllJob(
    page?: number,
    recordPerPage?: number,
    searchValue?: string,
    companyId?: string,
    userId?: any,
  ) {
    const response = await this.request({
      url: "v1/admin/all-jobs",
      method: "GET",
      params: {
        page,
        recordPerPage,
        searchValue,
        companyId,
        userId,
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

  async getJobById(id: string): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `v1/admin/get-job/${id}`,
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

  async deleteJob(id: string): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `v1/admin/delete-job/${id}`,
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

  async deleteJobFile(
    id: string,
    type: string,
    fileUrl: string,
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `v1/super-admin/delete-job-file/${id}?type=${type}&fileUrl=${fileUrl}`,
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

  // Add Job-type, City and Industry
  async addJobType(
    requestParameters: { companyId: string, jobTypeName: string; },
  ): Promise<SuccessResult<any> | ErrorResult> {
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

  async addIndustry(
    requestParameters: { companyId: string, industryName: string; },
  ): Promise<SuccessResult<any> | ErrorResult> {
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

  // Dropdown
  async getjobTypeData(
    companyId: string,
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/all-job-types",
      method: "GET",
      params: {
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
    return response as ErrorResult;
  }

  async getindustryData(
    companyId: string
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/all-industries",
      method: "GET",
      params: {
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
    return response as ErrorResult;
  }

  async getIcons(): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/get-icons",
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

export const JobApi = new _JobApi();
