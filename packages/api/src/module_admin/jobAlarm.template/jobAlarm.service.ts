import type { JobAlarm } from "../../models/jobAlarm";
import { CityModel, CompanyModel, JobAlarmModel, JobTypesModel } from "../../models";
import ObjectIdConverter from "../../utils/objectIdConvertor";

export class JobAlarmService {
  private readonly objectIdConverter: ObjectIdConverter;
  constructor() {
    this.objectIdConverter = new ObjectIdConverter();
  }

  public async add(addData: JobAlarm) {
    const data = await JobAlarmModel.create(addData);
    return data;
  }

  public async getById(id: string) {
    const data = await JobAlarmModel.findById(id)
      .populate("companyId")
      .populate("jobTypeId")
      .populate("city");
    return data;
  }

  public async updateById(id: string, datas: JobAlarm) {
    const data = await JobAlarmModel.findByIdAndUpdate(
      id,
      {
        $set: datas,
      },
      {
        new: true,
      },
    );
    return data;
  }

  public async getAll({
    searchValue,
    recordPerPage,
    companyId,
    startDate,
    endDate,
  }) {
    recordPerPage = recordPerPage ?? 10;
    recordPerPage = recordPerPage > 0 ? recordPerPage : 10;
    const objectId = this.objectIdConverter.convertToObjectId(companyId);

    const pipeline: any[] = [
      {
        $match: {
          isDeleted: false,
          companyId: objectId,
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
        $lookup: {
          from: JobTypesModel.collection.name,
          localField: "jobTypeId",
          foreignField: "_id",
          as: "jobTypeId",
        },
      },
      {
        $lookup: {
          from: CityModel.collection.name,
          localField: "cityId",
          foreignField: "_id",
          as: "cityId",
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
          name: 1,
          email: 1,
          companyName: { $arrayElemAt: ["$companyId.companyname", 0] },
          jobTypeName: { $arrayElemAt: ["$jobTypeId.jobTypeName", 0] },
          cityName: { $arrayElemAt: ["$cityId.name", 0] },
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

    const data = await JobAlarmModel.aggregate(pipeline).exec();
    return data;
  }

  public async deleteById(id: string) {
    const deleted = await JobAlarmModel.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true },
    );
    return deleted;
  }
}
