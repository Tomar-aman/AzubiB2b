import { type IndustriesDocument } from "src/models/industries";
import { IndustryModel } from "../../models";
import mongoose from "mongoose";
// import ObjectIdConverter from "../../utils/objectIdConvertor";

export class IndustriesService {
  // private readonly objectIdConverter: ObjectIdConverter;
  // constructor() {
  //   this.objectIdConverter = new ObjectIdConverter();
  // }

  public async addIndustry(data: IndustriesDocument) {
    const { 
      // companyId,
       industryName } = data;
    const newIndustry = await IndustryModel.create({
      // companyId,
      industryName,
    });
    return newIndustry;
  }

  public async getIndustryById(id: string) {
    const industry = await IndustryModel.findById(id);
    return industry;
  }

  public async updateIndustryById(id: string, industryName: IndustriesService) {
    const updatedIndustry = await IndustryModel.findByIdAndUpdate(
      id,
      {
        $set: { industryName },
      },
      { new: true },
    );
    return updatedIndustry;
  }

  public async getAllIndustries(
    // companyId: string,
    searchValue?: string,
    pageNo: number = 1,
    recordPerPage: number = 10,
  ) {
    // const objectId = this.objectIdConverter.convertToObjectId(companyId);
    const limit = Math.max(1, recordPerPage);
    const skip = (pageNo - 1) * limit;
    const pipeline: any[] = [
      { $match: { isDeleted: false,
        //  companyId: objectId 
        } },
    ];

    if (searchValue) {
      pipeline.push({
        $match: {
          industryName: { $regex: new RegExp(searchValue, "i") },
        },
      });
    }

    // pipeline.push({
    //   $lookup: {
    //     from: "companies",
    //     localField: "companyId",
    //     foreignField: "_id",
    //     as: "companyId",
    //   },
    // });

    // pipeline.push({
    //   $unwind: {
    //     path: "$companyId",
    //     preserveNullAndEmptyArrays: true,
    //   },
    // });

    pipeline.push({
      $project: {
        _id: 1,
        industryName: 1,
        // "companyId._id": 1,
        // "companyId.companyname": 1,
      },
    });

    pipeline.push({ $skip: skip }, { $limit: limit });

    const countPipeline = [...pipeline];
    countPipeline.splice(-2); // Remove $skip and $limit for count
    countPipeline.push({ $count: "totalCities" });

    const [industries, totalResult] = await Promise.all([
      IndustryModel.aggregate(pipeline),
      IndustryModel.aggregate(countPipeline),
    ]);

    const totalIndustries =
      totalResult.length > 0 ? totalResult[0].totalCities : 0;

    return { totalIndustries, industries };
  }

  public async deleteIndustryById(id: string) {
    const deletedIndustry = await IndustryModel.findByIdAndDelete(id);
    return deletedIndustry;
  }

  public async getAllIndustriesForApp(
    searchValue?: string,
    pageNo: number = 1,
    recordPerPage: number = 10,
    companyId?: string,
  ) {
    const limit = Math.max(1, recordPerPage);
    const skip = (pageNo - 1) * limit;
    const pipeline: any[] = [{ $match: { isDeleted: false } }];

    if (searchValue) {
      pipeline.push({
        $match: {
          industryName: { $regex: new RegExp(searchValue, "i") },
        },
      });
    }

    if (companyId) {
      pipeline.push({
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId),
        },
      });
    }

    pipeline.push({
      $lookup: {
        from: "companies",
        localField: "companyId",
        foreignField: "_id",
        as: "companyId",
      },
    });

    pipeline.push({
      $unwind: {
        path: "$companyId",
        preserveNullAndEmptyArrays: true,
      },
    });

    pipeline.push({
      $match: {
        "companyId.industryStatus": true,
      },
    });

    pipeline.push({
      $project: {
        _id: 1,
        industryName: 1,
        // status: 1,
        "companyId._id": 1,
        "companyId.companyname": 1,
        "companyId.industryStatus": 1,
      },
    });

    pipeline.push({ $skip: skip }, { $limit: limit });

    const countPipeline = [...pipeline];
    countPipeline.splice(-2); // Remove $skip and $limit for count
    countPipeline.push({ $count: "totalCities" });

    const [industries, totalResult] = await Promise.all([
      IndustryModel.aggregate(pipeline),
      IndustryModel.aggregate(countPipeline),
    ]);

    const totalIndustries =
      totalResult.length > 0 ? totalResult[0].totalCities : 0;

    return { totalIndustries, industries };
  }
}
