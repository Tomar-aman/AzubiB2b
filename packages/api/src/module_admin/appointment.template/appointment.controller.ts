import { type Request, type Response } from "express";
import { AppointmentFormService } from "./appointment.service";
import logger from "../../utils/logger";
import { CompanyModel, ManageCompanyModel } from "../../models";
import emailService from "../../utils/emailService";

class AppointmentFormController {
    private readonly appointmentFormService: AppointmentFormService;
    constructor() {
        this.appointmentFormService = new AppointmentFormService();
    }

    public add = async (req: Request, res: Response) => {
        try {
            const { companyId, name, email, phoneNumber, appointment } =
                req.body;
            const data: any = { companyId, name, email, phoneNumber, appointment };
            const form = await this.appointmentFormService.add(data);
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
                subject: "Appointment form",
                html: `<p><b>Name: </b> ${name}</p>
              <p><b>Email: </b> ${email}</p>
              <p><b>Phone no.: </b> ${phoneNumber}</p>
              <p>Message: <b>${appointment}</b></p>
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

    public appointmentContent = async (req: Request, res: Response) => {
        try {
            const companyId = (req as any).admin.id;
            const { text } = req.body;

            const data: any = { companyId, text };
            const content = await this.appointmentFormService.appointmentContent(data);

            res.sendSuccess200Response(
                "Appointment content added successfully",
                content
            )
        } catch (error) {
            logger.error("appointmentContent", error);
            res.sendErrorResponse("Error in appointmentContent", error);
        }
    };

    public getAppointmentContent = async (req: Request, res: Response) => {
        try {
            const companyId = (req as any).admin.id;
            const content = await this.appointmentFormService.getAppointmentContent(companyId);
            res.sendSuccess200Response("Content retrieved successfully", content);
        } catch (error) {
            logger.error("getAppointmentContent", error);
            res.sendErrorResponse("Error retrieving content", error);
        }
    };

    public getAppointmentContentForApp = async (req: Request, res: Response) => {
        try {
            const { companyId } = req.params;
            const privacyPolicyContent = await this.appointmentFormService.getAppointmentContentForApp({ companyId });
            res.sendSuccess200Response("Appointment content retrieved successfully", privacyPolicyContent);
        } catch (error) {
            logger.error("getAppointmentContentForApp", error);
            res.sendErrorResponse("Error retrieving appointment content", error);
        }
    }
};

export default AppointmentFormController;