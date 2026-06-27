import mongoose, { type FilterQuery } from "mongoose";
import {
  CityModel,
  CompanyModel,
  IndustryModel,
  ManageCompanyModel,
} from "../../models";
import { type CompanyDocument } from "../../models/company";
import bcrypt from "bcrypt";
import { type ManageCompanyDocument } from "../../models/manageCompany";

export class AdminCompanyService {
  public async findOneWithOptions(options: FilterQuery<CompanyDocument>) {
    const user = await CompanyModel.findOne(options);
    return user;
  }

  public async getAdminCompanyById(id: string): Promise<CompanyDocument> {
    const pipeline: any[] = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: CityModel.collection.name,
          localField: "city",
          foreignField: "_id",
          as: "city",
        },
      },
      {
        $lookup: {
          from: IndustryModel.collection.name,
          localField: "industryName",
          foreignField: "_id",
          as: "industry",
        },
      },
      {
        $project: {
          createdAt: 1,
          companyname: 1,
          email: 1,
          location: 1,
          contactPerson: 1,
          phoneNumber: 1,
          websiteLink: 1,
          instagram: 1,
          twitter: 1,
          facebook: 1,
          description: 1,
          qrCode: 1,
          industry: { $arrayElemAt: ["$industry.industryName", 0] },
          city: { $arrayElemAt: ["$city.name", 0] },
          status: 1,
        },
      },
    ];
    const company: any = await CompanyModel.aggregate(pipeline).exec();
    if (!company) {
      throw new Error("Company not found");
    }
    return company;
  }

  public async getAdminManageCompanyById(
    id: string,
  ): Promise<ManageCompanyDocument | null> {
    const company = await ManageCompanyModel.findOne({ companyId: id });
    return company;
  }

  public async getCompany(id: string): Promise<CompanyDocument> {
    const pipeline: any[] = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: CityModel.collection.name,
          localField: "city",
          foreignField: "_id",
          as: "city",
        },
      },
      {
        $lookup: {
          from: IndustryModel.collection.name,
          localField: "industryName",
          foreignField: "_id",
          as: "industryName",
        },
      },
      {
        $project: {
          profileIcon: 1,
          companyname: 1,
          email: 1,
          phoneNumber: 1,
          contactPerson: 1,
          companyImages: 1,
          industryName: { $arrayElemAt: ["$industryName._id", 0] },
          city: { $arrayElemAt: ["$city._id", 0] },
          location: 1,
          websiteLink: 1,
          instagram: 1,
          twitter: 1,
          facebook: 1,
          description: 1,
          status: 1,
        },
      },
    ];

    const company = await CompanyModel.aggregate(pipeline).exec();
    return company.length > 0 ? company[0] : null;
  }

  public async updateAdminCompanyById(
    id: string,
    newPassword?: string,
    oldPassword?: string,
    profileFields?: Record<string, any>,
    profileIcon?: string,
  ) {
    const company = await CompanyModel.findById(id);
    if (!company) {
      throw new Error("Company not found");
    }

    company.status = !company.status;

    if (oldPassword) {
      const isPasswordMatch = await bcrypt.compare(
        oldPassword,
        company.password,
      );
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

    if (profileIcon) {
      company.profileIcon = profileIcon;
    }

    await company.save();
    return company;
  }

  public async updateStatus(id: string) {
    const company = await CompanyModel.findById(id);
    if (!company) {
      throw new Error("Invalid City Id");
    }

    const updatedCompany = await CompanyModel.findOneAndUpdate(
      { _id: company._id },
      { status: !company.status },
      { new: true },
    );

    return updatedCompany;
  }

  public async getAllCompanies() {
    const pipeline: any[] = [{ $match: { isDeleted: false } }];

    pipeline.push({
      $project: {
        _id: 1,
        companyname: 1,
      },
    });

    const companies = await CompanyModel.aggregate(pipeline).exec();
    return companies;
  }

  public async getAllCompaniesForApp(searchValue, pageNo, recordPerPage) {
    const query = CompanyModel.find({ isDeleted: false }).select("-password");

    if (searchValue) {
      void query.or([
        {
          name: {
            $regex: new RegExp(searchValue, "i"),
          },
        },
      ]);
    }

    const filteredCompanies = await CompanyModel.find({
      isDeleted: false,
    });

    const limit = parseInt(recordPerPage || "0");
    const skip = (pageNo - 1) * limit;
    const count = filteredCompanies.length;

    const companies = await query
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();
    return {
      totalCompanies: count,
      companies,
    };
  }

  public async getCount(filter: any) {
    const companyCount = await CompanyModel.find().count(filter);
    return companyCount;
  }

  public async getCompanyByIdForApp(id: string): Promise<CompanyDocument> {
    const company = await CompanyModel.findById(id)
      .select("-password")
      .populate("industryName city");

    if (!company) {
      throw new Error("Company not found");
    }
    return company;
  }
}
