import type { Application } from "../../models/application";
import {
  ApplicationModel,
  CityModel,
  CompanyModel,
  IndustryModel,
  JobModel,
  JobTypesModel,
} from "../../models";
import ObjectIdConverter from "../../utils/objectIdConvertor";

export class ApplicationService {
  private readonly objectIdConverter: ObjectIdConverter;
  constructor() {
    this.objectIdConverter = new ObjectIdConverter();
  }

  public async add(data: Application) {
    const newData = await ApplicationModel.create(data);
    return newData;
  }

  public async getById(id: string) {
    const data = await ApplicationModel.findById(id); // .populate("jobId");
    return data;
  }

  public async updateById(id: string, data: Application) {
    const { attachement, ...otherFields } = data;
    const updateQuery: any = {
      $set: otherFields, // Update other fields
    };

    // Check if there are attachments to add
    if (attachement) {
      updateQuery.$push = { attachement: { $each: attachement } }; // Append attachments
    }
    const sideMenu = await ApplicationModel.findByIdAndUpdate(id, updateQuery, {
      new: true,
    });
    return sideMenu;
  }

  public async getAll({ recordPerPage, search, 
    // companyId 
  }) {
    recordPerPage = recordPerPage ?? 10;
    recordPerPage = recordPerPage > 0 ? recordPerPage : 10;
    // const objectId = this.objectIdConverter.convertToObjectId(companyId);

    const pipeline: any[] = [
      {
        $match: {
          isDeleted: false,
          // companyId: objectId,
        },
      },
      {
        $sort: { createdAt: -1 },
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
        $lookup: {
          from: JobModel.collection.name,
          localField: "jobId",
          foreignField: "_id",
          as: "jobId",
        },
      },
      {
        $unwind: {
          path: "$jobId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: CityModel.collection.name,
          localField: "jobId.city",
          foreignField: "_id",
          as: "jobId.city",
          pipeline: [
            {
              $project: {
                name: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: IndustryModel.collection.name,
          localField: "jobId.industryName",
          foreignField: "_id",
          as: "jobId.industryName",
          pipeline: [
            {
              $project: {
                industryName: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: JobTypesModel.collection.name,
          localField: "jobId.jobType",
          foreignField: "_id",
          as: "jobId.jobType",
          pipeline: [
            {
              $project: {
                jobTypeName: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
          aboutMe: 1,
          coverLetter: 1,
          attachement: 1,
          createdAt: 1,
          "companyId._id": 1,
          "companyId.companyname": 1,
          "companyId.profileIcon": 1,
          "companyId.tipsStatus": 1,
          "jobId._id": 1,
          "jobId.jobTitle": 1,
          "jobId.jobType": { $arrayElemAt: ["$jobId.jobType", 0] },
          // "jobId.city": { $arrayElemAt: ["$jobId.city", 0] },
          "jobId.city": 1,
          "jobId.industryName": { $arrayElemAt: ["$jobId.industryName", 0] },
          "jobId.email": 1,
          "jobId.address": 1,
          "jobId.jobDescription": 1,
          "jobId.videoLink": 1,
          "jobId.embeddedCode": 1,
          "jobId.additionalData": 1,
        },
      },
    ].filter(Boolean);

    // pipeline.push({
    //   $match: {
    //     "companyId.tipsStatus": true,
    //   },
    // });

    if (search) {
      pipeline.push({
        $match: {
          jobTitle: { $regex: new RegExp(search, "i") },
        },
      });
    }

    const application = await ApplicationModel.aggregate(pipeline).exec();

    return application;
  }

  public async deleteById(id: string) {
    const deleted = await ApplicationModel.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true },
    );
    return deleted;
  }

  public async deleteFileById(id: string) {
    const deleted = await ApplicationModel.findOneAndUpdate(
      { "attachement._id": id },
      { $pull: { attachement: { _id: id } } },
      { new: true },
    );
    return deleted;
  }

  // Admin
  public async getAllForAdmin({ recordPerPage, searchValue, id }) {
    recordPerPage = recordPerPage ?? 10;
    recordPerPage = recordPerPage > 0 ? recordPerPage : 10;
    const objectId = this.objectIdConverter.convertToObjectId(id);

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
        $lookup: {
          from: JobModel.collection.name,
          localField: "jobId",
          foreignField: "_id",
          as: "jobId",
        },
      },
      {
        $unwind: {
          path: "$jobId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: CityModel.collection.name,
          localField: "jobId.city",
          foreignField: "_id",
          as: "jobId.city",
          pipeline: [
            {
              $project: {
                name: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: IndustryModel.collection.name,
          localField: "jobId.industryName",
          foreignField: "_id",
          as: "jobId.industryName",
          pipeline: [
            {
              $project: {
                industryName: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: JobTypesModel.collection.name,
          localField: "jobId.jobType",
          foreignField: "_id",
          as: "jobId.jobType",
          pipeline: [
            {
              $project: {
                jobTypeName: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$attachement",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          email: { $first: "$email" },
          phone: { $first: "$phone" },
          aboutMe: { $first: "$aboutMe" },
          coverLetter: { $first: "$coverLetter" },
          attachement: { $push: "$attachement" },
          createdAt: { $first: "$createdAt" },
          companyId: { $first: "$companyId" },
          jobId: { $first: "$jobId" },
          imageCount: {
            $sum: {
              $cond: [
                {
                  $regexMatch: {
                    input: "$attachement.filetype",
                    regex: "^image/",
                  },
                },
                1,
                0,
              ],
            },
          },
          pdfCount: {
            $sum: {
              $cond: [
                { $eq: ["$attachement.filetype", "application/pdf"] },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
          aboutMe: 1,
          coverLetter: 1,
          attachement: 1,
          createdAt: 1,
          "companyId._id": 1,
          "companyId.companyname": 1,
          "jobId._id": 1,
          "jobId.jobTitle": 1,
          imageCount: 1,
          pdfCount: 1,
        },
      },
    ].filter(Boolean);

    if (searchValue) {
      pipeline.push({
        $match: {
          name: { $regex: new RegExp(searchValue, "i") },
        },
      });
    }

    const application = await ApplicationModel.aggregate(pipeline).exec();
    return application;
  }

  public async getByIdForAdmin(id: string) {
    const data = await ApplicationModel.findById(id).populate(
      "jobId",
      "jobTitle",
    );
    return data;
  }
}
