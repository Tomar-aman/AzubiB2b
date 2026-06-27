import * as runtime from "../runtime";
import { ErrorResult, SuccessResult } from "../runtimeType";

class _Sidemenu extends runtime.BaseAPI {
  constructor() {
    super();
  }

  async addSideMenuContent(
    requestParameters: any,
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/sidemenu",
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
  async getSideMenuData(): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/sidemenus",
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
  async deleteSidemenu(id: string): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `v1/admin/sidemenu/${id}`,
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

  async getSidemenuData(id: string): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `v1/admin/sidemenu/${id}`,
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

  async updateSideMenuContent(
    id: string,
    payload: Partial<{
      icon: string;
      name: string;
      url: string;
      color: string;
    }>,
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `v1/admin/sidemenu/${id}`,
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

  async addSendNotification(
    requestParameters: any,
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/notification",
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

  async getNotificationData(): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/get-notifications",
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

export const Sidemenu = new _Sidemenu();
