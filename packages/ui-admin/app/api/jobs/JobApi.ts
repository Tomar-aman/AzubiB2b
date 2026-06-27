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
      url: `v1/admin/job-status/${id}`,
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

  async getAllCompanies(): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/all-companies",
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

  async getAllJob(
    startDate: any,
    endDate: any,
    recordPerPage: number,
    searchValue: string,
    companyId: string,
  ) {
    const response = await this.request({
      url: "v1/admin/all-jobs",
      method: "GET",
      params: {
        startDate,
        endDate,
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

  async getDeletedJobs(searchValue: string) {
    const response = await this.request({
      url: "v1/admin/deleted-jobs",
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
      url: `v1/admin/delete-job-file/${id}?type=${type}&fileUrl=${fileUrl}`,
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

  async restoreJob(id: string): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `v1/admin/restore-job/${id}`,
      method: "PATCH",
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

  async getcityData(
    companyId: string,
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/all-cities",
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
    companyId: string,
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/all-industries",
      method: "GET",
      params: {
        companyId
      }
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

  async getjobs(): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/all-jobs",
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

  async getJobData(id: string): Promise<SuccessResult<any> | ErrorResult> {
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

  // Banner
  async addJobsBanner(
    requestParameters: any,
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/add-job-banner",
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

  async updateJobBannerData(id: string, payload: Partial<UpdateJob>) {
    const response = await this.request({
      url: `v1/admin/job-banner/${id}`,
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

  async getBannerData(id: string): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `v1/admin/get-job-banner/${id}`,
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

  async addAppColor(
    requestParameters: any,
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/app-color",
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
  async getAllColor(): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/get-app-color",
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
