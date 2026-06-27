import { type Request, type Response } from "express";
import logger from "../../utils/logger";
import { ContactFormService } from "./manageForm.service";
import { CompanyModel, ManageCompanyModel } from "../../models";
import emailService from "../../utils/emailService";

class ContactFormController {
  private readonly contactFormService: ContactFormService;
  constructor() {
    this.contactFormService = new ContactFormService();
  }

  public createForm = async (req: Request, res: Response) => {
    try {
      const { companyId, name, email, phoneNumber, message, dateOfBirth } =
        req.body;
      const data: any = { companyId, name, email, phoneNumber, message };
      const form = await this.contactFormService.add(data);
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
        subject: "Contact form",
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
        logger.error(
          "Email services are not allowed. To enable them, please contact the superadmin.",
        );
        res.sendBadRequest400Response(
          "Email services are not allowed. To enable them, please contact the superadmin.",
          data,
        );
      }
    } catch (error) {
      logger.error(error);
      res.sendErrorResponse("Error creating form", error);
    }
  };
}

export default ContactFormController;
