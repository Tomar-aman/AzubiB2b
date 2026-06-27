import * as runtime from "../runtime";
import { ErrorResult, SuccessResult } from "../runtimeType";
import {
  City,
  CreateCityRequestDto,
  TransformCity,
} from "./CreateCityReqResDto";

class _CityApi extends runtime.BaseAPI {
  constructor() {
    super();
  }

  async addCity(
    requestParameters: CreateCityRequestDto,
  ): Promise<SuccessResult<TransformCity> | ErrorResult> {
    const response = await this.request({
      url: "v1/admin/city",
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

  async getAllCities(
    pageNo: number,
    recordPerPage: number,
    searchValue: string,
  ) {
    const response = await this.request({
      url: "v1/admin/all-cities",
      method: "GET",
      params: {
        pageNo,
        recordPerPage,
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

  async getCityData(id: string): Promise<SuccessResult<City> | ErrorResult> {
    const response = await this.request({
      url: `v1/admin/city/${id}`,
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

  async updateCityData(
    id: string,
    payload: Partial<{
      name: string;
      address: string;
    }>,
  ): Promise<SuccessResult<TransformCity> | ErrorResult> {
    const response = await this.request({
      url: `v1/admin/city/${id}`,
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

  async updateStatus(id: string): Promise<SuccessResult<City> | ErrorResult> {
    const response = await this.request({
      url: `v1/admin/city/${id}`,
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

  async deleteCity(id: string): Promise<SuccessResult<City> | ErrorResult> {
    const response = await this.request({
      url: `v1/admin/city/${id}`,
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

export const CityApi = new _CityApi();
