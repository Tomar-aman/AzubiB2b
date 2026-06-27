import { type Request, type Response } from "express";
import logger from "../../utils/logger";
import { RegisterFormService } from "./registerForm.service";
import { UploadImage } from "../../utils/uploadImage";
import emailService from "../../utils/emailService";
import { CompanyModel, ManageCompanyModel } from "../../models";

class RegisterFormController {
  private readonly registerFormService: RegisterFormService;
  private readonly uploadImage: UploadImage;

  constructor() {
    this.registerFormService = new RegisterFormService();
    this.uploadImage = new UploadImage();
  }

  public createForm = async (req: Request, res: Response) => {
    try {
      const { companyId, name, email, phoneNumber, message, dateOfBirth } =
        req.body;
      const files1: any = req.files?.images;
      const files = Array.isArray(files1) ? files1 : [files1];
      const images: any = [];
      const data: any = {
        companyId,
        name,
        email,
        phoneNumber,
        message,
        dateOfBirth,
      };
      if (req.files) {
        for (let i = 0; i < files?.length; i++) {
          const atch: any = await this.uploadImage.uploadImage(
            files[i],
            "public/",
            true,
          );
          if (atch?.path) {
            images.push(atch);
          }
          if (images.length > 0 && i === files.length - 1) {
            data.images = images;
          }
        }
      }

      const form = await this.registerFormService.add(data);
      const company = await CompanyModel.findById(data.companyId);
      if (!company) {
        logger.error("Company not found");
      }
      const manageCompany = await ManageCompanyModel.findOne({
        companyId: company?._id,
      });
      const emailOptions: any = {
        companyId,
        bcc: "azubiregional.de@gmail.com",
        to: company?.email,
        subject: "Register form",
        html: `<p><b>Name: </b> ${name}</p>
        <p><b>Email: </b> ${email}</p>
        <p><b>Phone no.: </b> ${phoneNumber}</p>
        <p>Message: <b>${message}</b></p>
        <p><b>Date of Birth: </b> ${dateOfBirth}</p>
        `,
      };

      if (manageCompany?.manageEmailServices === true) {
        await emailService.sendEmail(emailOptions);
        res.sendSuccess200Response("Form create successfully", form);
      } else {
        logger.error("Email services are not allowed. To enable them, please contact the superadmin.")
        res.sendBadRequest400Response("Email services are not allowed. To enable them, please contact the superadmin.", data)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      logger.error(error);
      res.sendErrorResponse("Error creating form", error);
    }
  };

  public getAllForApp = async (req: Request, res: Response) => {
    try {
      const { searchValue, recordPerPage, companyId } = req.query;
      const forms = await this.registerFormService.getAllForApp({
        searchValue,
        recordPerPage: Number(recordPerPage),
        companyId,
      });

      res.sendSuccess200Response("Forms retrieved successfully", forms);
    } catch (error) {
      logger.error("getAllFormForApp", error);
      res.sendErrorResponse("Error retrieving register form", error);
    }
  };
}

export default RegisterFormController;
