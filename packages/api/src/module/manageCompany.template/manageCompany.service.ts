import { type ManageCompanyDocument } from "../../models/manageCompany";
import { CityModel, CompanyModel, ManageCompanyModel } from "../../models";
// import ObjectIdConverter from "../../utils/objectIdConvertor";
import { CityDocument } from "../../models/city";
export class ManageCompanyService {
  // private readonly objectIdConverter: ObjectIdConverter;
  // constructor() {
  //   this.objectIdConverter = new ObjectIdConverter();
  // }

  public async getManageCompanyById(
    id: string,
  ): Promise<ManageCompanyDocument | null> {
    const company = await ManageCompanyModel.findOne({ companyId: id });
    return company;
  }

  public async updateManageCompany(
    id: string,
    jobListingPage: string[],
    jobWall: string[],
    sideMenu: string[],
    manageAppColor: boolean,
    manageJobAlarm: boolean,
    manageIndustries: boolean,
    manageCities: boolean,
    manageBanners: boolean,
    manageStatus: boolean,
    manageEmailServices: boolean,
  ) {
    const company = await CompanyModel.findById(id);
    if (!company) {
      throw new Error("Company not found");
    }

    // eslint-disable-next-line prefer-const
    let companyStatus: any = await CompanyModel.findOne({ _id: company._id });

    let manageCompany = await ManageCompanyModel.findOne({
      companyId: company._id,
    });

    if (!manageCompany) {
      manageCompany = new ManageCompanyModel({
        companyId: company._id,
        jobListingPage: jobListingPage || [],
        jobWall: jobWall || [],
        sideMenu: sideMenu || [],
        manageAppColor,
        manageJobAlarm,
        manageIndustries,
        manageCities,
        manageBanners,
        manageStatus,
        manageEmailServices,
      });
    } else {
      if (jobListingPage?.length) {
        manageCompany.jobListingPage = [...new Set(jobListingPage)];
      }
      if (jobWall?.length) {
        manageCompany.jobWall = [...new Set(jobWall)];
      }
      if (sideMenu?.length) {
        manageCompany.sideMenu = [...new Set(sideMenu)]; // Replace old sideMenu with new values
      }
      manageCompany.manageAppColor = manageAppColor;
      manageCompany.manageJobAlarm = manageJobAlarm;
      manageCompany.manageIndustries = manageIndustries;
      manageCompany.manageCities = manageCities;
      manageCompany.manageBanners = manageBanners;
      manageCompany.manageStatus = manageStatus;
      manageCompany.manageEmailServices = manageEmailServices;
    }
    if (companyStatus) {
      companyStatus.status = manageCompany.manageStatus;
    }

    await manageCompany.save();
    if (companyStatus) {
      await companyStatus.save();
    }
    return manageCompany;
  }

  public async addCity(data: CityDocument) {
    const {
      //  companyId,
      name, address } = data;
    const newCity = await CityModel.create({
      // companyId,
      name,
      address,
    });
    return newCity;
  }

  public async getCompanyCities(
    // id: string,
    searchValue?: string,
    pageNo: number = 1,
    recordPerPage: number = 10,
  ) {
    // const objectId = this.objectIdConverter.convertToObjectId(id);
    const limit = Math.max(1, recordPerPage);
    const skip = (pageNo - 1) * limit;

    const pipeline: any[] = [
      {
        $match: {
          isDeleted: false,
          //  companyId: objectId
        }
      },
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

  public async updateCityStatus(id: string) {
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
}
