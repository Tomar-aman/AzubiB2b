export interface CreateManageCompanyRequestDto {
  companyId: string;
  jobListingPage?: string[];
  jobWall?: string[];
  sideMenu?: string[];
  manageAppColor?: string;
  manageJobAlarm?: string;
  manageIndustries?: string;
  manageCities?: string;
  manageBanners?: string;
  manageStatus?: string;
  manageEmailServices?: string;
}

export interface GetManageCompanyType {
  _id: string;
  companyId: string;
  jobListingPage?: string[];
  jobWall?: string[];
  sideMenu?: string[];
  manageAppColor?: boolean;
  manageJobAlarm?: boolean;
  manageIndustries?: boolean;
  manageCities?: boolean;
  manageBanners?: boolean;
  manageStatus?: boolean;
  manageEmailServices?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ManageCompanyType {
  _id: string;
  companyId: string;
  jobListingPage?: string[];
  jobWall?: string[];
  sideMenu?: string[];
  manageAppColor?: string;
  manageJobAlarm?: string;
  manageIndustries?: string;
  manageCities?: string;
  manageBanners?: string;
  manageStatus?: string;
  manageEmailServices?: string;
  createdAt: string;
  updatedAt: string;
}

// Define specific types for input JSON structures
type CreateManageCompanyRequestJson = {
  companyId: string;
  jobListingPage?: string[];
  jobWall?: string[];
  sideMenu?: string[];
  manageAppColor?: string;
  manageJobAlarm?: string;
  manageIndustries?: string;
  manageCities?: string;
  manageBanners?: string;
  manageStatus?: string;
  manageEmailServices?: string;
};

type CreateManageCompanyResponseJson = {
  _id: string;
  companyId: string;
  jobListingPage?: string[];
  jobWall?: string[];
  sideMenu?: string[];
  manageAppColor?: string;
  manageJobAlarm?: string;
  manageIndustries?: string;
  manageCities?: string;
  manageBanners?: string;
  manageStatus?: string;
  manageEmailServices?: string;
  createdAt: string;
  updatedAt: string;
};

function CreateManageCompanyRequestDtoFromJSONTyped(
  json: CreateManageCompanyRequestJson
): CreateManageCompanyRequestDto {
  return {
    companyId: json.companyId,
    jobListingPage: json.jobListingPage,
    jobWall: json.jobWall,
    sideMenu: json.sideMenu,
    manageAppColor: json.manageAppColor,
    manageJobAlarm: json.manageJobAlarm,
    manageIndustries: json.manageIndustries,
    manageCities: json.manageCities,
    manageBanners: json.manageBanners,
    manageStatus: json.manageStatus,
    manageEmailServices: json.manageEmailServices,
  };
}

export function CreateManageCompanyRequestDtoFromJSON(
  json: CreateManageCompanyRequestJson
): CreateManageCompanyRequestDto {
  return CreateManageCompanyRequestDtoFromJSONTyped(json);
}

function CreateManageCompanyResponseDtoFromJSONTyped(
  json: CreateManageCompanyResponseJson
): ManageCompanyType {
  return {
    _id: json._id,
    companyId: json.companyId,
    jobListingPage: json.jobListingPage,
    jobWall: json.jobWall,
    sideMenu: json.sideMenu,
    manageAppColor: json.manageAppColor,
    manageJobAlarm: json.manageJobAlarm,
    manageIndustries: json.manageIndustries,
    manageCities: json.manageCities,
    manageBanners: json.manageBanners,
    manageStatus: json.manageStatus,
    manageEmailServices: json.manageEmailServices,
    createdAt: json.createdAt,
    updatedAt: json.updatedAt,
  };
}

export function CreateCompanyResponseDtoFromJSON(
  json: CreateManageCompanyResponseJson
): ManageCompanyType {
  return CreateManageCompanyResponseDtoFromJSONTyped(json);
}
