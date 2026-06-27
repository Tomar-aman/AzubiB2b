import CompanyModel, { type CompanyDocument } from "../../models/company";
// import bcrypt from "bcrypt";
export class CompanyService {
  public async getAllCompanies(
    filter: any,
    page: number,
    recordPerPage: number,
  ): Promise<CompanyDocument[]> {
    const pageValue = page || 1;
    const recordPerPageValue = recordPerPage || 10;
    const skip = (pageValue - 1) * recordPerPageValue;

    const sortField = "createdAt";
    const sortOrder = -1;

    const companies = await CompanyModel.aggregate([
      { $match: filter },
      { $sort: { [sortField]: sortOrder } },
      { $skip: skip },
      { $limit: recordPerPageValue },
    ]);
    return companies;
  }

  public async getCount(filter: any) {
    const companyCount = await CompanyModel.find().count(filter);
    return companyCount;
  }

  public async deleteCompany(id: string) {
    const company = await CompanyModel.findByIdAndDelete(id);
    return company;
  }

  public async getCompanyById(id: string): Promise<CompanyDocument> {
    const company = await CompanyModel.findById(id).select("-password");
    if (!company) {
      throw new Error("Company not found");
    }
    return company;
  }

  public async updateCompany(
    id: string,
    newPassword?: string,
    oldPassword?: string,
    profileFields?: Record<string, any>,
  ) {
    const company = await CompanyModel.findById(id);
    if (!company) {
      throw new Error("Company not found");
    }

    if (oldPassword) {
      const isPasswordMatch = await company.comparePassword(oldPassword);
      if (!isPasswordMatch) {
        throw new Error("Old password is incorrect");
      }
    }

    if (newPassword) {
      company.password = newPassword;
    }

    if (profileFields) {
      Object.assign(company, profileFields);
    }

    await company.save();
    return company;
  }
}
