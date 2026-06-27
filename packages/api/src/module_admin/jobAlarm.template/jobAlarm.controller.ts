import { type Request, type Response } from "express";
import { JobAlarmService } from "./jobAlarm.service";
import logger from "../../utils/logger";
import ObjectIdConverter from "../../utils/objectIdConvertor";
import { CityModel, CompanyModel, JobTypesModel } from "../../models";
import emailService from "../../utils/emailService";

class JobAlarmController {
  private readonly titleName: string;
  private readonly Service: JobAlarmService;
  private readonly objectId: ObjectIdConverter;

  constructor() {
    this.titleName = "job alarm";
    this.Service = new JobAlarmService();
    this.objectId = new ObjectIdConverter();
  }

  public add = async (req: Request, res: Response) => {
    try {
      const { companyId, jobTypeId, cityId, name, email } = req.body;

      const data: any = {
        companyId: this.objectId.convertToObjectId(companyId),
        jobTypeId: this.objectId.convertToObjectId(jobTypeId),
        cityId: this.objectId.convertToObjectId(cityId),
        name,
        email,
      };
      const company = await CompanyModel.findById(data.companyId);
      const city = await CityModel.findById(data.cityId);
      const jobType = await JobTypesModel.findById(data.jobTypeId);

      if (!company) {
        logger.error("Company not found");
      };

      const newData = await this.Service.add(data);
      const emailOptions: any = {
        companyId,
        to: company?.email,
        subject: "Job Alarm",
        html: `<p><b>Name: </b> ${name}</p>
              <p><b>Email: </b> ${email}</p>
              <p><b>City: </b> ${city?.name}</p>
              <p><b>Jobtype: </b>${jobType?.jobTypeName}</p>
              `,
      };
      await emailService.sendEmail(emailOptions);
      res.sendCreated201Response(
        this.titleName + " added successfully",
        newData,
      );
    } catch (error) {
      logger.error("Error adding " + this.titleName, error);
      res.sendErrorResponse("Error adding " + this.titleName, error);
    }
  };

  public getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this.Service.getById(id);
      if (!data) {
        res.sendNotFound404Response(this.titleName + " not found", null);
        return;
      }

      res.sendSuccess200Response(
        this.titleName + " retrieved successfully",
        data,
      );
    } catch (error) {
      logger.error("Error retrieving " + this.titleName, error);
      res.sendErrorResponse("Error retrieving " + this.titleName, error);
    }
  };

  public updateById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      const data: any = {
        // companyId: this.objectId.convertToObjectId(req.body.companyId),
        // jobTypeId: this.objectId.convertToObjectId(req.body.jobTypeId),
        name,
        email,
      };

      const updated = await this.Service.updateById(id, data);

      res.sendSuccess200Response(
        this.titleName + " updated successfully",
        updated,
      );
    } catch (error) {
      logger.error("Error updating " + this.titleName, error);
      res.sendErrorResponse("Error updating " + this.titleName, error);
    }
  };

  public getAll = async (req: Request, res: Response) => {
    try {
      const { searchValue, recordPerPage, startDate, endDate } = req.query;
      const companyId = (req as any).admin.id;

      const data = await this.Service.getAll({
        recordPerPage: Number(recordPerPage),
        searchValue,
        companyId,
        startDate,
        endDate,
      });

      res.sendSuccess200Response(
        this.titleName + " retrieved successfully",
        data,
      );
    } catch (error) {
      logger.error("Error retrieving " + this.titleName, error);
      res.sendErrorResponse("Error retrieving " + this.titleName, error);
    }
  };

  public deleteById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await this.Service.deleteById(id);

      res.sendSuccess200Response(
        this.titleName + " deleted successfully",
        deleted,
      );
    } catch (error) {
      logger.error("Error deleting " + this.titleName, error);
      res.sendErrorResponse("Error deleting " + this.titleName, error);
    }
  };
}

export default JobAlarmController;
