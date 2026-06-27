import * as runtime from "../runtime";
import urlcat from "urlcat";
import { ErrorResult, SuccessResult } from "../runtimeType";
import { CreateUserRequestDto } from "./CreateUserRequestDto";
import {
  CreateUserResponseDtoFromJSON,
  UserType,
} from "../auth/CreateUserResponseDto";
import { AccessTokensResponseDto } from "./AccessTokenResponseDto";
import { LoginRequestDto, LoginResponseDto } from "./LoginReqResDto";

class _AuthApi extends runtime.BaseAPI {
  constructor() {
    super();
  }
  async createUser(
    requestParameters: CreateUserRequestDto
  ): Promise<SuccessResult<UserType> | ErrorResult> {
    const response = await this.request({
      url: `/auth/create-user`,
      method: "POST",
      data: requestParameters,
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: {
          message: response.data.message,
          status: response.data.status,
          data: CreateUserResponseDtoFromJSON(response.data.data),
        },
      };
    }
    return response as ErrorResult;
  }

  async login(
    requestParameters: LoginRequestDto
  ): Promise<SuccessResult<LoginResponseDto> | ErrorResult> {
    const response = await this.request({
      url: `v1/super-admin/auth/create-session`,
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

  async logout(): Promise<SuccessResult<string> | ErrorResult> {
    const response = await this.request({
      url: `v1/super-admin/auth/logout`,
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

  async refreshAccessToken(
    token: string
  ): Promise<SuccessResult<AccessTokensResponseDto> | ErrorResult> {
    const response = await this.request({
      url: urlcat(`/auth/refresh-access-token`, { token }),
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

  async forgotPassword(
    email: string
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `v1/super-admin/auth/reset-password-link/${email}`,
      method: "GET",
    });
    if (response.remote === "success") {
      return response as any;
    }
    return response as ErrorResult;
  }

  async resetPassword(
    password: string,
    token: string
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/super-admin/auth/reset-password",
      method: "PUT",
      data: { password, token },
    });
    if (response.remote === "success") {
      return response as any;
    }
    return response as ErrorResult;
  }

  async getSuperAdminData(): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/super-admin/detail",
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

  async updateData(
    payload: Partial<{
      firstName: string;
      lastName: string;
      email: string;
      oldPassword: string;
      newPassword: string;
    }>
  ): Promise<SuccessResult<any> | ErrorResult> {
    if (payload.newPassword && !payload.oldPassword) {
      return {
        remote: "error",
        message: "Old password is required when setting a new password.",
        status: 400,
      } as unknown as ErrorResult;
    }

    const response = await this.request({
      url: "v1/super-admin/update",
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

export const AuthApi = new _AuthApi();
