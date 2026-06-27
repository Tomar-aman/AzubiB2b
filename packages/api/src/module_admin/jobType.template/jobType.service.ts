import ObjectIdConverter from "../../utils/objectIdConvertor";
import { JobTypesModel } from "../../models";
import mongoose from "mongoose";
import { type JobTypesDocument } from "../../models/jobType";

export class JobTypesService {
  private readonly objectIdConverter: ObjectIdConverter;
  constructor() {
    this.objectIdConverter = new ObjectIdConverter();
  }

  public async addJobType(data: JobTypesDocument) {
    const { 
      // companyId, 
      jobTypeName } = data;
    const newJobType = await JobTypesModel.create({
      // companyId,
      jobTypeName,
    });
    return newJobType;
  }

  public async getJobTypeById(id: string) {
    const jobType = await JobTypesModel.findById(id);
    return jobType;
  }

  public async updateJobTypeById(id: string, jobTypeName: JobTypesService) {
    const objectId = this.objectIdConverter.convertToObjectId(id);
    const updatedJobType = await JobTypesModel.findByIdAndUpdate(
      objectId,
      { $set: { jobTypeName } },
      { new: true },
    );
    return updatedJobType;
  }

  public async getAllJobTypes(
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
          jobTypeName: { $regex: new RegExp(searchValue, "i") },
        },
      });
    }

    // pipeline.push({
    //   $lookup: {
    //     from: "companies", // Collection name for companies
    //     localField: "companyId",
    //     foreignField: "_id",
    //     as: "companyId", // Replace companyId with actual company details
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
        jobTypeName: 1,
        // "companyId._id": 1,
        // "companyId.companyname": 1,
      },
    });

    pipeline.push({ $skip: skip }, { $limit: limit });

    const countPipeline = [...pipeline];
    countPipeline.splice(-2); // Remove $skip and $limit for count
    countPipeline.push({ $count: "totalJobTypes" });

    const [jobTypes, totalResult] = await Promise.all([
      JobTypesModel.aggregate(pipeline),
      JobTypesModel.aggregate(countPipeline),
    ]);

    const totalJobTypes =
      totalResult.length > 0 ? totalResult[0].totalJobTypes : 0;

    return { totalJobTypes, jobTypes };
  }

  public async deleteJobTypeById(id: string) {
    const deletedJobType = await JobTypesModel.findByIdAndDelete(id);
    return deletedJobType;
  }

  public async getAllJobTypesForApp(
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
          jobTypeName: { $regex: new RegExp(searchValue, "i") },
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
        from: "companies", // Collection name for companies
        localField: "companyId",
        foreignField: "_id",
        as: "companyId", // Replace companyId with actual company details
      },
    });

    pipeline.push({
      $unwind: {
        path: "$companyId",
        preserveNullAndEmptyArrays: true,
      },
    });

    pipeline.push({
      $project: {
        _id: 1,
        jobTypeName: 1,
        "companyId._id": 1,
        "companyId.companyname": 1,
      },
    });

    pipeline.push({ $skip: skip }, { $limit: limit });

    const countPipeline = [...pipeline];
    countPipeline.splice(-2); // Remove $skip and $limit for count
    countPipeline.push({ $count: "totalJobTypes" });

    const [jobTypes, totalResult] = await Promise.all([
      JobTypesModel.aggregate(pipeline),
      JobTypesModel.aggregate(countPipeline),
    ]);

    const totalJobTypes =
      totalResult.length > 0 ? totalResult[0].totalJobTypes : 0;

    return { totalJobTypes, jobTypes };
  }
}
