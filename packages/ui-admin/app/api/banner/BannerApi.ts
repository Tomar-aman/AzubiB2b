import * as runtime from "../runtime";
import { ErrorResult, SuccessResult } from "../runtimeType";
import { Banner } from "./CreateBannerReqResDto";

class _BannerApi extends runtime.BaseAPI {
  constructor() {
    super();
  }

  async getAllBanners(recordPerPage: number, searchValue: string) {
    const response = await this.request({
      url: "v1/admin/all-job-banners",
      method: "GET",
      params: {
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

  async deleteBanner(id: string): Promise<SuccessResult<Banner> | ErrorResult> {
    const response = await this.request({
      url: `v1/admin/delete-job-banner/${id}`,
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

export const BannerApi = new _BannerApi();
