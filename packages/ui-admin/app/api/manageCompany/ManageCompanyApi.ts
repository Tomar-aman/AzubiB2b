import * as runtime from "../runtime";
import { ErrorResult, SuccessResult } from "../runtimeType";
import { ManageCompanyType } from "./CreateManageCompanyReqResDto";

class _ManageCompanyApi extends runtime.BaseAPI {
  constructor() {
    super();
  }

  async getManageCompanyData(): Promise<
    SuccessResult<ManageCompanyType> | ErrorResult
  > {
    const response = await this.request({
      url: "v1/admin/manage-company",
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

export const ManageCompanyApi = new _ManageCompanyApi();
