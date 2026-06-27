import { type Job } from "../../models/jobs";
import {
  CityModel,
  CompanyModel,
  IndustryModel,
  JobModel,
  JobTypesModel,
} from "../../models";
import mongoose from "mongoose";
import ObjectIdConverter from "../../utils/objectIdConvertor";

export class JobService {
  private readonly objectIdConverter: ObjectIdConverter;
  constructor() {
    this.objectIdConverter = new ObjectIdConverter();
  }

  public async addJob(jobData: Job) {
    const newJob = await JobModel.create(jobData);
    return newJob;
  }

  public async getDeletedJobs({ searchValue, recordPerPage }) {
    recordPerPage = recordPerPage ?? 10;
    recordPerPage = recordPerPage > 0 ? recordPerPage : 10;

    const pipeline: any[] = [
      {
        $match: {
          isDeleted: true,
        },
      },
      {
        $sort: { deletedAt: -1 },
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
        $unwind: {
          path: "$industryName",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          jobTitle: 1,
          status: 1,
          createdAt: 1,
          city: 1,
          industryName: 1,
        },
      },
      {
        $addFields: {
          cities: {
            $reduce: {
              input: "$city.name",
              initialValue: "",
              in: {
                $cond: [
                  { $eq: ["$$value", ""] }, // If the initial value is empty
                  "$$this", // Start with the current element
                  { $concat: ["$$value", ", ", "$$this"] }, // Append city name with a comma
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          jobTitle: 1,
          status: 1,
          createdAt: 1,
          cities: 1,
          industryName: "$industryName.industryName",
        },
      },
    ].filter(Boolean);

    if (searchValue) {
      pipeline.push({
        $match: {
          jobTitle: {
            $regex: new RegExp(searchValue, "i"),
          },
        },
      });
    }

    const filteredJobs = await JobModel.aggregate(pipeline).exec();

    return filteredJobs;
  }

  public async updateJobById(id: string, fields?: Record<string, any>) {
    const job = await JobModel.findById(id);

    if (!job) {
      throw new Error("Job not found");
    }

    if (fields) {
      Object.assign(job, fields);
    }

    await job.save();
    return job;
  }

  public async getAllJobs({
    startDate,
    endDate,
    searchValue,
    recordPerPage,
    companyId,
    userId,
  }) {
    recordPerPage = recordPerPage ?? 10;
    recordPerPage = recordPerPage > 0 ? recordPerPage : 10;
    const objectId = this.objectIdConverter.convertToObjectId(companyId);
    const userObjectId = this.objectIdConverter.convertToObjectId(userId);

    const pipeline: any[] = [
      {
        $match: {
          isDeleted: false,
          ...(companyId && { companyId: objectId }),
          ...(userId && { userId: userObjectId }),
          ...(startDate &&
            endDate && {
            createdAt: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          }),
        },
      },
      {
        $sort: { createdAt: -1 },
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
        $lookup: {
          from: CompanyModel.collection.name,
          localField: "companyId",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        $unwind: {
          path: "$industryName",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$company",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          jobTitle: 1,
          status: 1,
          jobDescription: 1,
          createdAt: 1,
          city: 1,
          industryName: 1,
          company: 1,
        },
      },
      {
        $addFields: {
          concatenatedCities: {
            $reduce: {
              input: "$city.name",
              initialValue: "",
              in: {
                $cond: [
                  { $eq: ["$$value", ""] }, // If the initial value is empty
                  "$$this", // Start with the current element
                  { $concat: ["$$value", ", ", "$$this"] }, // Append city name with a comma
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          jobTitle: 1,
          status: 1,
          jobDescription: 1,
          createdAt: 1,
          concatenatedCities: 1,
          industryName: "$industryName.industryName",
          companyId: "$company._id",
          companyName: "$company.companyname",
        },
      },
    ].filter(Boolean);

    if (searchValue) {
      pipeline.push({
        $match: {
          $or: [
            { jobTitle: { $regex: new RegExp(searchValue, "i") } },
            { email: { $regex: new RegExp(searchValue, "i") } },
          ],
        },
      });
    }

    const jobs = await JobModel.aggregate(pipeline).exec();
    return jobs;
  }

  public async getJobById(id: string) {
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
          as: "company",
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
          localField: "industryName",
          foreignField: "_id",
          as: "industry",
        },
      },
      {
        $addFields: {
          cities: {
            $reduce: {
              input: "$city._id", // Use city IDs
              initialValue: [], // Initialize as an empty array
              in: {
                $cond: [
                  { $eq: [{ $size: "$$value" }, 0] }, // Check if initial value is empty
                  ["$$this"], // Start with the current city ID
                  { $concatArrays: ["$$value", ["$$this"]] }, // Append the city ID as an array
                ],
              },
            },
          },
        },
      },
      {
        $addFields: {
          cityNames: {
            $reduce: {
              input: "$city.name",
              initialValue: "",
              in: {
                $cond: [
                  { $eq: ["$$value", ""] }, // If the initial value is empty
                  "$$this", // Start with the current element
                  { $concat: ["$$value", ", ", "$$this"] }, // Append city name with a comma
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          company: { $arrayElemAt: ["$company._id", 0] },
          jobType: { $arrayElemAt: ["$jobType._id", 0] },
          industry: { $arrayElemAt: ["$industry._id", 0] },
          cities: 1,
          cityNames: 1,
          jobTitle: 1,
          email: 1,
          phoneNumber: 1,
          additionalEmail: 1,
          address: 1,
          mapUrl: 1,
          locationField: 1,
          locationUrl: 1,
          jobDescription: 1,
          attachement: 1,
          videoLink: 1,
          jobImages: 1,
          embeddedCode: 1,
          status: 1,
          additionalData: 1,
          createdAt: 1,
          updatedAt: 1,
          companyName: { $arrayElemAt: ["$company.companyname", 0] },
          industryName: { $arrayElemAt: ["$industry.industryName", 0] },
          jobTypeName: { $arrayElemAt: ["$jobType.jobTypeName", 0] }
        },
      },
    ];

    const job = await JobModel.aggregate(pipeline).exec();
    return job.length > 0 ? job[0] : null;
  }

  public async getAllJobsForApp({
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
        $lookup: {
          from: IndustryModel.collection.name,
          localField: "industryName",
          foreignField: "_id",
          as: "industryName",
        },
      },
      {
        $unwind: {
          path: "$industryName",
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
        $project: {
          jobTitle: 1,
          email: 1,
          phoneNumber: 1,
          address: 1,
          jobDescription: 1,
          videoLink: 1,
          embeddedCode: 1,
          additionalData: 1,
          status: 1,
          image: 1,
          createdAt: 1,
          cityId: "$city._id",
          "city._id": 1,
          "city.name": 1,
          "companyId._id": 1,
          "companyId.companyname": 1,
          "companyId.profileIcon": 1,
          "industryName._id": 1,
          "industryName.industryName": 1,
          "jobType._id": 1,
          "jobType.jobTypeName": 1,
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
          cityId: {
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
          "industryName._id": {
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

    const jobs = await JobModel.aggregate(pipeline).exec();
    return jobs;
  }

  // For app
  public async getCount() {
    const jobCount = await JobModel.find().count({
      isDeleted: false,
    });
    return jobCount;
  }

  public async getJobByIdForApp(id: string) {
    const job = await JobModel.findById(id).populate([
      { path: "city", select: "name" },
      { path: "industryName", select: "industryName" },
      {
        path: "companyId",
        select:
          "companyname email contactPerson profileIcon website phoneNumber",
      },
      { path: "jobType", select: "jobTypeName" },
    ]);

    return job;
  }

  public async updateStatus(id: string) {
    const job = await JobModel.findById(id);
    if (!job) {
      throw new Error("Invalid job Id");
    }

    const updatedJob = await JobModel.findOneAndUpdate(
      { _id: job._id },
      { status: !job.status },
      { new: true },
    );

    return updatedJob;
  }
}
