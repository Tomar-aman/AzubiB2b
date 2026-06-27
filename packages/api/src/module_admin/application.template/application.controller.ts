import { type Request, type Response } from "express";
import { ApplicationService } from "./application.service";
import logger from "../../utils/logger";
import { UploadImage } from "../../utils/uploadImage";
import emailService from "../../utils/emailService";
import { CompanyModel, ManageCompanyModel } from "../../models";

class ApplicationController {
  private readonly titleName: string;
  private readonly Service: ApplicationService;
  private readonly uploadImage: UploadImage;

  constructor() {
    this.titleName = "application";
    this.Service = new ApplicationService();
    this.uploadImage = new UploadImage();
  }

  public add = async (req: Request, res: Response) => {
    try {
      const { companyId, jobId, name, email, phone, aboutMe, coverLetter } =
        req.body;
      const files1: any = req.files?.attachement;
      const files = Array.isArray(files1) ? files1 : [files1];
      const attachement: any = [];
      const data: any = {
        companyId,
        jobId,
        name,
        email,
        phone,
        aboutMe,
        coverLetter,
      };
      if (req.files) {
        for (let i = 0; i < files?.length; i++) {
          const atch: any = await this.uploadImage.uploadImage(
            files[i],
            "public/application/",
            true,
          );
          if (atch?.path) {
            attachement.push(atch);
          }
          if (attachement.length > 0 && i === files.length - 1) {
            data.attachement = attachement;
          }
        }
      }

      const newData = await this.Service.add(data);
      const company = await CompanyModel.findById(data.companyId);
      if (!company) {
        logger.error("Company not found");
      }
      const manageCompany = await ManageCompanyModel.findOne({
        companyId: company?._id,
      });
      const attachementPath = attachement
        .map(
          (item: any) =>
            // `<a href="http://localhost:4000/${item.path}" target="_blank">http://localhost:4000/${item.path}</a>`,
            `<a href="${process.env.BACKEND_URL}/${item.path}" target="_blank">${process.env.BACKEND_URL}/${item.path}</a>`,
        )
        .join("<br>");

      const emailOptions: any = {
        companyId,
        bcc: "azubiregional.de@gmail.com",
        to: company?.email,
        subject: "Apply-job-form",
        html: `<p><b>Name: </b> ${name}</p>
        <p><b>Email: </b> ${email}</p>
        <p><b>Phone number: </b> ${phone}</p>
        <p><b>About: </b> ${aboutMe}</p>
        <p>Begleitscreiben: <b>${coverLetter}</b></p>
        <p>Attachments: <b>${attachementPath}</b></p>
        `,
      };

      if (manageCompany?.manageEmailServices) {
        await emailService.sendEmail(emailOptions);
        res.sendCreated201Response(
          this.titleName + " added successfully",
          newData,
        );
      } else {
        logger.error(
          "Email services are not allowed. To enable them, please contact the superadmin.",
        );
        res.sendBadRequest400Response(
          "Email services are not allowed. To enable them, please contact the superadmin.",
          data,
        );
      }
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
      const { jobId, name, email, phone, aboutMe, coverLetter } = req.body;
      const files1: any = req.files?.attachement;
      const files = Array.isArray(files1) ? files1 : [files1];

      const attachement: any = [];
      const data: any = {
        jobId,
        name,
        email,
        phone,
        aboutMe,
        coverLetter,
      };

      if (req.files) {
        for (let i: number = 0; i < files?.length; i++) {
          const atch: any = await this.uploadImage.uploadImage(
            files[i],
            "public/application/",
            true,
          );
          if (atch?.path) {
            attachement.push(atch);
          }
          if (attachement.length > 0 && i === files?.length - 1) {
            data.attachement = attachement;
          }
        }
      }

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
      const { recordPerPage, search, 
        // companyId 
      } = req.query;

      const data = await this.Service.getAll({
        recordPerPage: Number(recordPerPage),
        search,
        // companyId,
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

  public deleteFileById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await this.Service.deleteFileById(id);

      res.sendSuccess200Response(
        this.titleName + " file deleted successfully",
        deleted,
      );
    } catch (error) {
      logger.error("Error deleting file " + this.titleName, error);
      res.sendErrorResponse("Error deleting file " + this.titleName, error);
    }
  };

  // Admin
  public getAllForAdmin = async (req: Request, res: Response) => {
    try {
      const id = (req as any).admin.id;
      const { recordPerPage, searchValue } = req.query;

      const data = await this.Service.getAllForAdmin({
        recordPerPage: Number(recordPerPage),
        searchValue,
        id,
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

  public getByIdForAdmin = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this.Service.getByIdForAdmin(id);
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
}

export default ApplicationController;
