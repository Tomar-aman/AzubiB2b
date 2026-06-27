import { LoginRequestDto, LoginType } from "../models/LoginReqResDto";
import * as runtime from "../runtime";
// import urlcat from "urlcat";
import { ErrorResult, SuccessResult } from "../runtimeType";
import { CompanyData } from "./CreateCompanyReqResDto";

class _AuthApi extends runtime.BaseAPI {
  constructor() {
    super();
  }

  async login(
    requestParameters: LoginRequestDto,
  ): Promise<SuccessResult<LoginType> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/login",
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

  async getCompanyById(): Promise<SuccessResult<CompanyData> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/company",
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

  async getCompanyByName(name: string): Promise<SuccessResult<CompanyData> | ErrorResult> {
    const response = await this.request({
      url: `v1/admin/company/${name}`,
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

  async updateCompany(formData: FormData): Promise<SuccessResult<CompanyData> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/company",
      method: "PUT",
      data: formData,
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

  async deleteCompanyImages(id: string, fileUrl: string): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `v1/admin/delete-company-images/${id}?fileUrl=${fileUrl}`,
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

  async updateStatus(
    id: string,
  ): Promise<SuccessResult<CompanyData> | ErrorResult> {
    const response = await this.request({
      url: `v1/admin/company-status/${id}`,
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

  async forgotPassword(
    companyName: any,
    email: string,
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `v1/admin/reset-link/${companyName}/${email}`,
      method: "GET",
    });
    if (response.remote === "success") {
      return response as any;
    }
    return response as ErrorResult;
  }

  async resetPassword(
    password: string,
    token: string,
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "/v1/admin/reset-password/",
      method: "PUT",
      data: { password, token },
    });
    if (response.remote === "success") {
      return response as any;
    }
    return response as ErrorResult;
  }
}

export const AuthApi = new _AuthApi();
