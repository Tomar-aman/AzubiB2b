import { type Request, type Response } from "express";
import logger from "../../utils/logger";
import { CityService } from "./city.service";

class CityController {
  private readonly cityService: CityService;

  constructor() {
    this.cityService = new CityService();
  }

  public addCity = async (req: Request, res: Response) => {
    try {
      // const id = (req as any).admin.id;

      const newCity = await this.cityService.addCity({
        ...req.body,
        // companyId: id,
      });
      res.sendCreated201Response("City added successfully", newCity);
    } catch (error) {
      logger.error("addCity", error);
      res.sendErrorResponse("Error adding city", error);
    }
  };

  public getCityById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const city = await this.cityService.getCityById(id);

      if (!city) {
        res.sendNotFound404Response("City not found", null);
        return;
      }

      res.sendSuccess200Response("City retrieved successfully", city);
    } catch (error) {
      logger.error("getCityById", error);
      res.sendErrorResponse("Error retrieving city", error);
    }
  };

  public updateCityById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedCity = await this.cityService.updateCityById(id, req.body);

      res.sendSuccess200Response("City updated successfully", updatedCity);
    } catch (error) {
      logger.error("updateCityById", error);
      res.sendErrorResponse("Error updating city", error);
    }
  };

  public updateStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedCity = await this.cityService.updateStatus(id);

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

  public getAllCities = async (req: Request, res: Response) => {
    try {
      // const id = (req as any).admin.id;
      const { searchValue, pageNo, recordPerPage } = req.query;

      const cities = await this.cityService.getAllCities(
        // id,
        searchValue as string,
        pageNo as unknown as number,
        recordPerPage as unknown as number,
      );

      res.sendSuccess200Response("Cities retrieved successfully", cities);
    } catch (error) {
      logger.error("getAllCities", error);
      res.sendErrorResponse("Error retrieving cities", error);
    }
  };

  public deleteCityById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedCity = await this.cityService.deleteCityById(id);

      res.sendSuccess200Response("City deleted successfully", deletedCity);
    } catch (error) {
      logger.error("deleteCityById", error);
      res.sendErrorResponse("Error deleting city", error);
    }
  };

  public getAllCitiesForApp = async (req: Request, res: Response) => {
    try {
      const { searchValue, companyId } = req.query;

      const cities = await this.cityService.getAllCitiesForApp(
        searchValue as string,
        companyId as string,
      );

      res.sendSuccess200Response("Cities retrieved successfully", cities);
    } catch (error) {
      logger.error("getAllCities", error);
      res.sendErrorResponse("Error retrieving cities", error);
    }
  };
}

export default CityController;
