import * as runtime from "../runtime";
import { ErrorResult, SuccessResult } from "../runtimeType";

class _ContentApi extends runtime.BaseAPI {
  constructor() {
    super();
  }

  async addContent(
    requestParameters: any,
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/manage_content/sidemenu",
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
  async getContentData(): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/manage_content/get-sidemenu-content",
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
  async addWallContent(
    requestParameters: any,
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/manage_content/job-wall-content",
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
  async getWallContentData(): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/manage_content/get-jobwall-content",
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

  //sidebaar apis

  async addsidebarContent(
    requestParameters: any,
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/add-sidebar-content",
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

  async getsidebarData(): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/get-sidebar-content",
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

  async addtipssidebarContent(
    requestParameters: any,
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/add-tips-content",
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

  async gettipssidebarData(): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/get-tips-content",
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

  async addalarmContent(
    requestParameters: any,
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/add-alarm-content",
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

  async getalarmData(): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/get-alarm-content",
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

  async getJobAlarmData(
    searchValue: string,
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/job-alarms",
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
    return response as ErrorResult;
  }
}

export const ContentApi = new _ContentApi();
