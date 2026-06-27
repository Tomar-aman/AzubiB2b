import mongoose from "mongoose";
import {
  CityModel,
  CompanyModel,
  IndustryModel,
  JobBannerModel,
  JobModel,
  JobTypesModel,
} from "../../models";
import { type JobBannerDocument } from "../../models/jobBanner";
import ObjectIdConverter from "../../utils/objectIdConvertor";

export class JobBannerService {
  private readonly objectIdConverter: ObjectIdConverter;
  constructor() {
    this.objectIdConverter = new ObjectIdConverter();
  }

  public async createBanner(payload: JobBannerDocument) {
    if (!payload.addLine) {
      payload.addLine = [];
    } else if (typeof payload.addLine === "string") {
      payload.addLine = [{ text: payload.addLine }];
    } else if (Array.isArray(payload.addLine)) {
      payload.addLine = payload.addLine.map((line: any) =>
        typeof line === "string" ? { text: line } : line,
      );
    }

    if (payload.addLine.length > 5) {
      throw new Error("The addLine array cannot contain more than 5 items.");
    }

    const newBanner = await JobBannerModel.create(payload);
    return newBanner;
  }

  public async deleteBannerById(id: string) {
    const deletedBanner = await JobBannerModel.findByIdAndDelete(id);
    return deletedBanner;
  }

  public async updateBannerById(
    id: string,
    fields?: Record<string, any>,
    images?: string,
  ) {
    const banner = await JobBannerModel.findById(id);

    if (!banner) {
      throw new Error("Banner not found");
    }

    if (fields?.addLine) {
      let updatedAddLine = fields.addLine;

      // Ensure input is always an array of objects with 'text' property
      if (typeof updatedAddLine === "string") {
        updatedAddLine = [{ text: updatedAddLine }];
      } else if (Array.isArray(updatedAddLine)) {
        updatedAddLine = updatedAddLine.map((line: any) =>
          typeof line === "string" ? { text: line } : line,
        );
      }

      // fields.addLine = [...(banner.addLine ?? []), ...fields.addLine];
      fields.addLine = updatedAddLine;

      if (fields.addLine.length > 5) {
        throw new Error("The addLine array cannot contain more than 5 items.");
      }
    }

    if (fields) {
      Object.assign(banner, fields);
    }

    if (images) {
      banner.images = images;
    }

    await banner.save();
    return banner;
  }

  public async getAllBanners({ searchValue, recordPerPage, companyId }) {
    recordPerPage = recordPerPage ?? 10;
    recordPerPage = recordPerPage > 0 ? recordPerPage : 10;
    const objectId = this.objectIdConverter.convertToObjectId(companyId);

    const pipeline: any[] = [
      {
        $match: {
          isDeleted: false,
          companyId: objectId,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $lookup: {
          from: JobModel.collection.name,
          localField: "job",
          foreignField: "_id",
          as: "job",
        },
      },
      {
        $lookup: {
          from: CompanyModel.collection.name,
          localField: "companyId",
          foreignField: "_id",
          as: "companyId",
        },
      },
      {
        $project: {
          bannerTitle: 1,
          jobUrl: 1,
          companyName: { $arrayElemAt: ["$companyId.companyname", 0] },
          job: { $arrayElemAt: ["$job.jobTitle", 0] },
        },
      },
    ].filter(Boolean);

    if (searchValue) {
      pipeline.push({
        $match: {
          bannerTitle: { $regex: new RegExp(searchValue, "i") },
        },
      });
    }

    const banners = await JobBannerModel.aggregate(pipeline).exec();
    return banners;
  }

  public async getBannerById(id: string) {
    const pipeline: any[] = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: CompanyModel.collection.name,
          localField: "companyId",
          foreignField: "_id",
          as: "companyId",
        },
      },
      {
        $lookup: {
          from: JobModel.collection.name,
          localField: "job",
          foreignField: "_id",
          as: "job",
        },
      },
      {
        $lookup: {
          from: JobTypesModel.collection.name,
          localField: "jobType",
          foreignField: "_id",
          as: "jobType",
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
          localField: "industry",
          foreignField: "_id",
          as: "industry",
        },
      },
      {
        $project: {
          company: { $arrayElemAt: ["$companyId._id", 0] },
          city: { $arrayElemAt: ["$city._id", 0] },
          industry: { $arrayElemAt: ["$industry._id", 0] },
          jobType: { $arrayElemAt: ["$jobType._id", 0] },
          job: { $arrayElemAt: ["$job._id", 0] },
          jobUrl: 1,
          bannerTitle: 1,
          images: 1,
          embeddedCode: 1,
          addLine: 1,
        },
      },
    ].filter(Boolean);
    const banner = await JobBannerModel.aggregate(pipeline).exec();
    return banner.length > 0 ? banner[0] : null;
  }

  // For app
  public async getAllBannersForApp({
    searchValue,
    recordPerPage,
    selectedCities,
    industry,
    jobType,
    companyId,
  }) {
    recordPerPage = recordPerPage ?? 10;
    recordPerPage = recordPerPage > 0 ? recordPerPage : 10;
    const objectId = this.objectIdConverter.convertToObjectId(companyId);

    const pipeline: any[] = [
      {
        $match: {
          isDeleted: false,
          companyId: objectId,
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
        $unwind: {
          path: "$city",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: IndustryModel.collection.name,
          localField: "industry",
          foreignField: "_id",
          as: "industry",
        },
      },
      {
        $unwind: {
          path: "$industry",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: JobTypesModel.collection.name,
          localField: "jobType",
          foreignField: "_id",
          as: "jobType",
        },
      },
      {
        $unwind: {
          path: "$jobType",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: JobModel.collection.name,
          localField: "job",
          foreignField: "_id",
          as: "job",
        },
      },
      {
        $unwind: {
          path: "$job",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: CompanyModel.collection.name,
          localField: "companyId",
          foreignField: "_id",
          as: "companyId",
        },
      },
      {
        $unwind: {
          path: "$companyId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          addLine: { $ifNull: ["$addLine", []] },
        },
      },
      {
        $project: {
          bannerTitle: 1,
          embeddedCode: 1,
          addLine: 1,
          jobUrl: 1,
          images: 1,
          "city._id": 1,
          "city.name": 1,
          "companyId._id": 1,
          "companyId.companyname": 1,
          "companyId.images": 1,
          "industry._id": 1,
          "industry.industryName": 1,
          "jobType._id": 1,
          "jobType.jobTypeName": 1,
          "job._id": 1,
          "job.jobTitle": 1,
        },
      },
    ].filter(Boolean);

    if (searchValue) {
      pipeline.push({
        $match: {
          jobTitle: { $regex: new RegExp(searchValue, "i") },
        },
      });
    }

    if (selectedCities && selectedCities.length > 0) {
      pipeline.push({
        $match: {
          "city._id": {
            $in: selectedCities.map(
              (city) => new mongoose.Types.ObjectId(city),
            ),
          },
        },
      });
    }

    if (industry && industry.length > 0) {
      pipeline.push({
        $match: {
          "industry._id": {
            $in: industry.map(
              (industry) => new mongoose.Types.ObjectId(industry),
            ),
          },
        },
      });
    }

    if (jobType && jobType.length > 0) {
      pipeline.push({
        $match: {
          "jobType._id": {
            $in: jobType.map((jobType) => new mongoose.Types.ObjectId(jobType)),
          },
        },
      });
    }

    const banners = await JobBannerModel.aggregate(pipeline).exec();
    return banners;
  }
}
