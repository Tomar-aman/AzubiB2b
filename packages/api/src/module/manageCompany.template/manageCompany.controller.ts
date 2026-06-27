import { type Request, type Response } from "express";
import logger from "../../utils/logger";
import { ManageCompanyService } from "../manageCompany.template/manageCompany.service";

class ManageCompanyController {
  private readonly manageCompanyService: ManageCompanyService;

  constructor() {
    this.manageCompanyService = new ManageCompanyService();
  }

  public getManageCompanyById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const company = await this.manageCompanyService.getManageCompanyById(id);
      res.sendSuccess200Response("Company retrived successfully", company);
    } catch (error) {
      logger.error("getCompanyById", error);
      res.sendErrorResponse("Error updating profile", error);
    }
  };

  public updateManageCompany = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const {
        jobListingPage,
        jobWall,
        sideMenu,
        manageAppColor,
        manageJobAlarm,
        manageIndustries,
        manageCities,
        manageBanners,
        manageStatus,
        manageEmailServices,
      } = req.body;

      const updatedCompany =
        await this.manageCompanyService.updateManageCompany(
          id,
          jobListingPage,
          jobWall,
          sideMenu,
          manageAppColor,
          manageJobAlarm,
          manageIndustries,
          manageCities,
          manageBanners,
          manageStatus,
          manageEmailServices,
        );

      res.sendSuccess200Response(
        "Company updated successfully",
        updatedCompany,
      );
    } catch (error) {
      logger.error("updateManageCompany", error);
      res.sendErrorResponse("Error updating profile", error);
    }
  };

  public addCity = async (req: Request, res: Response) => {
    try {
      const newCity = await this.manageCompanyService.addCity(req.body);
      res.sendCreated201Response("City added successfully", newCity);
    } catch (error) {
      logger.error("addCity", error);
      res.sendErrorResponse("Error adding city", error);
    }
  };

  public getCompanyCities = async (req: Request, res: Response) => {
    try {
      // const { id } = req.params;
      const { searchValue, pageNo, recordPerPage } = req.query;

      const cities = await this.manageCompanyService.getCompanyCities(
        // id,
        searchValue as string,
        pageNo as unknown as number,
        recordPerPage as unknown as number,
      );

      res.sendSuccess200Response("Company retrived successfully", cities);
    } catch (error) {
      logger.error("getCompanyCities", error);
      res.sendErrorResponse("Error getting cities", error);
    }
  };

  public updateCityStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedCity = await this.manageCompanyService.updateCityStatus(id);

      if (!updatedCity) {
        res.sendNotFound404Response("City not found", null);
        return;
      }

      const message = updatedCity.status ? "Active" : "Inactive";

      res.sendSuccess200Response(message, updatedCity);
    } catch (error) {
      logger.error("updateStatus", error);
      res.sendErrorResponse("Error updating status", error);
    }
  };
}

export default ManageCompanyController;
