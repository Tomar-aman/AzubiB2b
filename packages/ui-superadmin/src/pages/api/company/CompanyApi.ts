import {
  CompanyType,
  CreateCompanyRequestDto,
  CreateCompanyResponseDtoFromJSON,
} from "./CreateCompanyReqResDto";
import * as runtime from "../runtime";
import { ErrorResult, SuccessResult } from "../runtimeType";
import { ManageCompanyType } from "./CreateManageCompanyReqResDto";
import { CreateCityRequestDto, TransformCity } from "./CreateCityReqResDto";

class _CompanyApi extends runtime.BaseAPI {
  constructor() {
    super();
  }
  async createCompany(
    requestParameters: CreateCompanyRequestDto,
  ): Promise<SuccessResult<CompanyType> | ErrorResult> {
    const response = await this.request({
      url: "v1/super-admin/create-company",
      method: "POST",
      data: requestParameters,
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: {
          message: response.data.message,
          status: response.data.status,
          data: CreateCompanyResponseDtoFromJSON(response.data.data.company),
        },
      };
    }
    return response as ErrorResult;
  }

  async getAllCompanies({
    page,
    recordPerPage,
    search,
    userId,
  }: {
    page?: number;
    recordPerPage?: number;
    search?: string;
    userId?: any;
  }) {
    const response = await this.request({
      url: `v1/super-admin/companies`,
      method: "GET",
      params: {
        page,
        recordPerPage,
        search,
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

  async deleteCompany(
    id: string,
  ): Promise<SuccessResult<CompanyType> | ErrorResult> {
    const response = await this.request({
      url: `v1/super-admin/delete-company/${id}`,
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

  async getCompanyData(
    id: string,
  ): Promise<SuccessResult<CompanyType> | ErrorResult> {
    const response = await this.request({
      url: `v1/super-admin/company/${id}`,
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

  async updateCompanyData(
    id: string,
    payload: Partial<{
      companyname: string;
      email: string;
      oldPassword: string;
      newPassword: string;
      smtpHost: string;
      smtpPort: string;
      smtpUserName: string;
      smtpPassword: string;
      smtpEncryption: string;
      smtpAddress: string;
      smtpService: string;
      headingOneColor: string;
      headingTwoColor: string;
      manageEmail: string;
      manageSavedJob: string;
    }>,
  ): Promise<SuccessResult<CompanyType> | ErrorResult> {
    if (payload.newPassword && !payload.oldPassword) {
      return {
        remote: "error",
        message: "Old password is required when setting a new password.",
        status: 400,
      } as unknown as ErrorResult;
    }

    const response = await this.request({
      url: `v1/super-admin/company/${id}`,
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

  async updateManageCompany(
    id: string,
    payload: Partial<{
      jobListingPage?: string[];
      jobWall?: string[];
      sideMenu?: string[];
      manageJobAlarm?: boolean;
      manageIndustries?: boolean;
      manageCities?: boolean;
      manageBanners?: boolean;
      manageStatus?: boolean;
    }>,
  ): Promise<SuccessResult<ManageCompanyType> | ErrorResult> {
    const response = await this.request({
      url: `v1/super-admin/manage-company/${id}`,
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

  async getManageCompanyData(
    id: string,
  ): Promise<SuccessResult<ManageCompanyType> | ErrorResult> {
    const response = await this.request({
      url: `v1/super-admin/manage-company/${id}`,
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

  // City
  async addCity(
    requestParameters: CreateCityRequestDto,
  ): Promise<SuccessResult<TransformCity> | ErrorResult> {
    const response = await this.request({
      url: "v1/super-admin/add-city",
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
    id: string,
    pageNo?: number,
    recordPerPage?: number,
    searchValue?: string,
  ) {
    const response = await this.request({
      url: `v1/super-admin/all-cities/${id}`,
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

  async updateCityStatus(
    id: string,
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `v1/super-admin/city-status/${id}`,
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

  // Privacy policy
  async addPrivacyPolicyContent(
    requestParameters: any,
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/super-admin/privacy-policy",
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

  async getPrivacyPolicyData(): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/super-admin/policy",
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

  // Impressum
  async addImpressumContent(
    requestParameters: any,
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/super-admin/impressum",
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

  async getImpressumData(): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "v1/super-admin/impressum",
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
export const CompanyApi = new _CompanyApi();
