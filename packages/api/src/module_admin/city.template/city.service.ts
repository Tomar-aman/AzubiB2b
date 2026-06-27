import mongoose, { type Schema } from "mongoose";
import { CityModel } from "../../models";
import { type CityDocument } from "../../models/city";
// import ObjectIdConverter from "../../utils/objectIdConvertor";

export class CityService {
  // private readonly objectIdConverter: ObjectIdConverter;
  // constructor() {
  //   this.objectIdConverter = new ObjectIdConverter();
  // }

  public async addCity(data: CityDocument) {
    const { 
      // companyId, 
      name, address } = data;
    const newCity = await CityModel.create({
      // companyId,
      name,
      address,
    });
    return newCity;
  }

  public async getCityById(id: string) {
    const city = await CityModel.findById(id);
    return city;
  }

  public async updateCityById(
    id: string,
    updatedCityData: Schema<CityDocument>,
  ) {
    const updatedCity = await CityModel.findByIdAndUpdate(id, updatedCityData, {
      new: true,
    });
    return updatedCity;
  }

  public async updateStatus(id: string) {
    const city = await CityModel.findById(id);
    if (!city) {
      throw new Error("Invalid City Id");
    }

    const updatedCity = await CityModel.findOneAndUpdate(
      { _id: city._id },
      { status: !city.status },
      { new: true },
    );

    return updatedCity;
  }

  public async getAllCities(
    // id: string,
    searchValue?: string,
    pageNo: number = 1,
    recordPerPage: number = 10,
  ) {
    // const objectId = this.objectIdConverter.convertToObjectId(id);
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
          name: { $regex: new RegExp(searchValue, "i") },
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
        name: 1,
        address: 1,
        status: 1,
        // "companyId._id": 1,
        // "companyId.companyname": 1,
      },
    });

    pipeline.push({ $skip: skip }, { $limit: limit });

    const countPipeline = [...pipeline];
    countPipeline.splice(-2); // Remove $skip and $limit for count
    countPipeline.push({ $count: "totalCities" });

    const [cities, totalResult] = await Promise.all([
      CityModel.aggregate(pipeline),
      CityModel.aggregate(countPipeline),
    ]);

    const totalCities = totalResult.length > 0 ? totalResult[0].totalCities : 0;

    return { totalCities, cities };
  }

  public async deleteCityById(id: string) {
    const deletedCity = await CityModel.findByIdAndDelete(id);
    return deletedCity;
  }

  public async getAllCitiesForApp(
    searchValue?: string,
    companyId?: string,
  ) {
    const pipeline: any[] = [{ $match: { isDeleted: false } }];

    if (searchValue) {
      pipeline.push({
        $match: {
          name: { $regex: new RegExp(searchValue, "i") },
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
      $match: {
        "status": true,
      },
    });

    pipeline.push({
      $project: {
        _id: 1,
        name: 1,
        address: 1,
        status: 1,
        "companyId._id": 1,
        "companyId.companyname": 1,
        "companyId.cityStatus": 1,
      },
    });

    const countPipeline = [...pipeline];
    countPipeline.splice(-2);
    countPipeline.push({ $count: "totalCities" });

    const [cities, totalResult] = await Promise.all([
      CityModel.aggregate(pipeline),
      CityModel.aggregate(countPipeline),
    ]);

    const totalCities = totalResult.length > 0 ? totalResult[0].totalCities : 0;

    return { totalCities, cities };
  }
}
