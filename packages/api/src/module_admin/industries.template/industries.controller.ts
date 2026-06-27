import { type Request, type Response } from "express";
import logger from "../../utils/logger";
import { IndustriesService } from "./industries.service";

class IndustriesController {
  private readonly industriesService: IndustriesService;

  constructor() {
    this.industriesService = new IndustriesService();
  }

  public addIndustry = async (req: Request, res: Response) => {
    try {
      // const id = (req as any).admin.id;
      const newIndustry = await this.industriesService.addIndustry({
        ...req.body,
        // companyId: id,
      });

      res.sendCreated201Response("Industry added successfully", newIndustry);
    } catch (error) {
      logger.error("addIndustry", error);
      res.sendErrorResponse("Error adding industry", error);
    }
  };

  public getIndustryById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const industry = await this.industriesService.getIndustryById(id);

      if (!industry) {
        res.sendNotFound404Response("Industry not found", null);
        return;
      }

      res.sendSuccess200Response("Industry retrieved successfully", industry);
    } catch (error) {
      logger.error("getIndustryById", error);
      res.sendErrorResponse("Error retrieving industry", error);
    }
  };

  public updateIndustryById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { industryName: updatedIndustryData } = req.body;
      const updatedIndustry = await this.industriesService.updateIndustryById(
        id,
        updatedIndustryData,
      );

      res.sendSuccess200Response(
        "Industry updated successfully",
        updatedIndustry,
      );
    } catch (error) {
      logger.error("updateIndustryById", error);
      res.sendErrorResponse("Error updating industry", error);
    }
  };

  public getAllIndustries = async (req: Request, res: Response) => {
    try {
      // const id = (req as any).admin.id;
      const {
        // companyId,
        searchValue,
        pageNo,
        recordPerPage,
      } = req.query;

      const industries = await this.industriesService.getAllIndustries(
        // companyId as string,
        searchValue as string,
        pageNo as unknown as number,
        recordPerPage as unknown as number,
      );

      res.sendSuccess200Response(
        "Industries retrieved successfully",
        industries,
      );
    } catch (error) {
      logger.error("getAllIndustries", error);
      res.sendErrorResponse("Error retrieving industries", error);
    }
  };

  public deleteIndustryById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedIndustry =
        await this.industriesService.deleteIndustryById(id);

      res.sendSuccess200Response(
        "Job type marked as deleted successfully",
        deletedIndustry,
      );
    } catch (error) {
      logger.error("deleteIndustryById", error);
      res.sendErrorResponse("Error deleting industry", error);
    }
  };

  public getAllIndustriesForApp = async (req: Request, res: Response) => {
    try {
      const { searchValue, pageNo, recordPerPage, companyId } = req.query;

      const industries = await this.industriesService.getAllIndustriesForApp(
        searchValue as string,
        pageNo as unknown as number,
        recordPerPage as unknown as number,
        companyId as string,
      );

      res.sendSuccess200Response(
        "Industries retrieved successfully",
        industries,
      );
    } catch (error) {
      logger.error("getAllIndustries", error);
      res.sendErrorResponse("Error retrieving industries", error);
    }
  };
}
export default IndustriesController;
