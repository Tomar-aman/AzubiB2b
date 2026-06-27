export interface CreateCompanyRequestDto {
  companyname: string;
  email: string;
  password: string;
  smtpHost?: string;
  smtpPort?: string;
  smtpUserName?: string;
  smtpPassword?: string;
  smtpEncryption?: string;
  smtpAddress?: string;
  smtpService?: string;
  headingOneColor?: string;
  headingTwoColor?: string;
  manageEmail?: string;
  manageSavedJob?: string;
}

export interface CompanyType {
  companyname: string;
  email: string;
  _id: string;
  smtpHost?: string;
  smtpPort?: string;
  smtpUserName?: string;
  smtpPassword?: string;
  smtpEncryption?: string;
  smtpAddress?: string;
  smtpService?: string;
  headingOneColor?: string;
  headingTwoColor?: string;
  manageEmail?: string;
  manageSavedJob?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyData {
  _id: string;
  createdAt: string;
  companyname: string;
  email: string;
  contactPerson: string;
  phoneNumber: string;
  industryName: string;
  city: string;
  location: string;
  websiteLink: string;
  instagram: string;
  twitter: string;
  facebook: string;
  description: string;
  qrCode: string;
  companyImages: string[];
  status?: boolean;
}

// Define specific types for input JSON structures
type CreateCompanyRequestJson = {
  companyname: string;
  email: string;
  password: string;
  smtpHost?: string;
  smtpPort?: string;
  smtpUserName?: string;
  smtpPassword?: string;
  smtpEncryption?: string;
  smtpAddress?: string;
  smtpService?: string;
  headingOneColor?: string;
  headingTwoColor?: string;
  manageEmail?: string;
  manageSavedJob?: string;
};

type CreateCompanyResponseJson = {
  _id: string;
  companyname: string;
  email: string;
  smtpHost?: string;
  smtpPort?: string;
  smtpUserName?: string;
  smtpPassword?: string;
  smtpEncryption?: string;
  smtpAddress?: string;
  smtpService?: string;
  headingOneColor?: string;
  headingTwoColor?: string;
  manageEmail?: string;
  manageSavedJob?: string;
  createdAt: string;
  updatedAt: string;
};

function CreateCompanyRequestDtoFromJSONTyped(
  json: CreateCompanyRequestJson,
): CreateCompanyRequestDto {
  return {
    companyname: json.companyname,
    email: json.email,
    password: json.password,
    smtpHost: json.smtpHost,
    smtpPort: json.smtpPort,
    smtpUserName: json.smtpUserName,
    smtpPassword: json.smtpPassword,
    smtpEncryption: json.smtpEncryption,
    smtpAddress: json.smtpAddress,
    smtpService: json.smtpService,
    headingOneColor: json.headingOneColor,
    headingTwoColor: json.headingTwoColor,
    manageEmail: json.manageEmail,
    manageSavedJob: json.manageSavedJob,
  };
}

export function CreateCompanyRequestDtoFromJSON(
  json: CreateCompanyRequestJson,
): CreateCompanyRequestDto {
  return CreateCompanyRequestDtoFromJSONTyped(json);
}

function CreateCompanyResponseDtoFromJSONTyped(
  json: CreateCompanyResponseJson,
): CompanyType {
  return {
    _id: json._id,
    companyname: json.companyname,
    email: json.email,
    smtpHost: json.smtpHost,
    smtpPort: json.smtpPort,
    smtpUserName: json.smtpUserName,
    smtpPassword: json.smtpPassword,
    smtpEncryption: json.smtpEncryption,
    smtpAddress: json.smtpAddress,
    smtpService: json.smtpService,
    headingOneColor: json.headingOneColor,
    headingTwoColor: json.headingTwoColor,
    manageEmail: json.manageEmail,
    manageSavedJob: json.manageSavedJob,
    createdAt: json.createdAt,
    updatedAt: json.updatedAt,
  };
}

export function CreateCompanyResponseDtoFromJSON(
  json: CreateCompanyResponseJson,
): CompanyType {
  return CreateCompanyResponseDtoFromJSONTyped(json);
}
