import { type Request, type Response } from "express";
import logger from "../../utils/logger";
import { JobTypesService } from "./jobType.service";

class JobTypesController {
  private readonly jobTypesService: JobTypesService;

  constructor() {
    this.jobTypesService = new JobTypesService();
  }

  public addJobType = async (req: Request, res: Response) => {
    try {
      // const id = (req as any).admin.id;

      const newJobType = await this.jobTypesService.addJobType({
        ...req.body,
        // companyId: id,
      });

      res.sendCreated201Response("Job type added successfully", newJobType);
    } catch (error) {
      logger.error("addJobType", error);
      res.sendErrorResponse("Error adding job type", error);
    }
  };

  public getJobTypeById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const jobType = await this.jobTypesService.getJobTypeById(id);

      if (!jobType) {
        res.sendNotFound404Response("JobType not found", null);
        return;
      }
      res.sendSuccess200Response("Job type retrieved successfully", jobType);
    } catch (error) {
      res.sendErrorResponse("Error retriving job type", error);
    }
  };

  public updateJobTypeById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { jobTypeName: updatedJobTypeData } = req.body;
      const updatedJobType = await this.jobTypesService.updateJobTypeById(
        id,
        updatedJobTypeData,
      );

      res.sendSuccess200Response(
        "Job type updated successfully",
        updatedJobType,
      );
    } catch (error) {
      logger.error("updateJobTypeById", error);
      res.sendErrorResponse("Error updating job type", error);
    }
  };

  public getAllJobTypes = async (req: Request, res: Response) => {
    try {
      // const id = (req as any).admin.id;
      const { 
        // companyId,
         searchValue, pageNo, recordPerPage } = req.query;

      const jobTypes = await this.jobTypesService.getAllJobTypes(
        // companyId as string,
        searchValue as string,
        pageNo as unknown as number,
        recordPerPage as unknown as number,
      );

      res.sendSuccess200Response("Job types retrieved successfully", jobTypes);
    } catch (error) {
      logger.error("getAllJobTypes", error);
      res.sendErrorResponse("Error retrieving job types", error);
    }
  };

  public deleteJobTypeById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedJobType = await this.jobTypesService.deleteJobTypeById(id);

      res.sendSuccess200Response(
        "Job type marked as deleted successfully",
        deletedJobType,
      );
    } catch (error) {
      logger.error("deleteJobBannerById", error);
      res.sendErrorResponse("Error deleting job type", error);
    }
  };

  public getAllJobTypesForApp = async (req: Request, res: Response) => {
    try {
      const { searchValue, pageNo, recordPerPage, companyId } = req.query;

      const jobTypes = await this.jobTypesService.getAllJobTypesForApp(
        searchValue as string,
        pageNo as unknown as number,
        recordPerPage as unknown as number,
        companyId as string,
      );
      res.sendSuccess200Response("Job types retrieved successfully", jobTypes);
    } catch (error) {
      logger.error("getAllJobTypes", error);
      res.sendErrorResponse("Error retrieving job types", error);
    }
  };
}

export default JobTypesController;
