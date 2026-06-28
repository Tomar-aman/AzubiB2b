import { type Request, type Response } from "express";
import logger from "../../utils/logger";
import { CompanyModel, UserModel } from "../../models";
import { CompanyService } from "./company.service";
import emailService from "../../utils/emailService";
import QRCode from "qrcode";

class CompanyController {
  private readonly companyService: CompanyService;

  constructor() {
    this.companyService = new CompanyService();
  }

  public createCompany = async (req: Request, res: Response) => {
    try {
      const loggedInUserEmail = req.user?.email;
      const loggedInUserId = req.user?.id;
      if (loggedInUserId) {
        const user = await UserModel.findById(loggedInUserId);
        console.log("Logged in user details:", user);
        if (user && user.role === "Sub-SuperAdmin") {
          req.body.userId = loggedInUserId;
        }
      }
      const companyname = await CompanyModel.findOne({
        companyname: req.body.companyname,
      });
      const companyExist = await CompanyModel.findOne({
        email: req.body.email,
      });

      if (companyname) {
        return res.status(422).json({
          error: "Company name already exist",
        });
      }

      if (companyExist) {
        return res.status(422).json({
          error: "Email already exist",
        });
      }
      req.body.smtpHost = process.env.EMAIL_HOST;
      req.body.smtpPort = process.env.EMAIL_PORT;
      req.body.smtpUserName = process.env.EMAIL_USER;
      req.body.smtpPassword = process.env.EMAIL_PASS;
      const company = await CompanyModel.create(req.body);

      const url = `${process.env.ADMIN_URL}?company=${req.body.companyname}`;

      const qrCode = await QRCode.toDataURL(
        `${process.env.BACKEND_URL}/qr/fallback.html?companyId=${company._id}`,
      );

      company.qrCode = qrCode;
      await company.save();

      const emailOptions: any = {
        to: req.body.email,
        bcc: loggedInUserEmail,
        subject: "Welcome to Company Job App – Your Company Is Ready",
        html: `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 24px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 24px; border-radius: 6px;">
      
      <h2 style="color: #333;">Welcome to Company Job App</h2>

      <p style="color: #555; font-size: 14px;">
        We’re happy to inform you that your company account has been successfully created on <strong>Company Job App</strong>.
      </p>

      <h3 style="color: #333; margin-top: 24px;">Company Account Details</h3>

      <table style="width: 100%; font-size: 14px; color: #555;">
        <tr>
          <td style="padding: 6px 0;"><strong>Company Name:</strong></td>
          <td>${req.body.companyname}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0;"><strong>Admin Panel:</strong></td>
          <td>
            <a href="${url}" style="color: #1a73e8;">${url}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 6px 0;"><strong>Temporary Password:</strong></td>
          <td>${req.body.password}</td>
        </tr>
      </table>

      <p style="margin-top: 20px; font-size: 14px; color: #555;">
        🔒 For security reasons, we strongly recommend changing your password after your first login.
      </p>

      <p style="margin-top: 24px; font-size: 14px; color: #555;">
        If you have any questions or need assistance, feel free to contact our support team.
      </p>

      <p style="margin-top: 32px; font-size: 14px; color: #555;">
        Best regards,<br>
        <strong>Company Job App Team</strong>
      </p>

    </div>
  </div>
  `,
      };

      await emailService.sendEmail(emailOptions);
      res.sendCreated201Response("Company created successfully", { company });
    } catch (error) {
      logger.error("createCompany", error);
      res.sendErrorResponse("Error creating company", error);
    }
  };

  public getAllCompanies = async (req: Request, res: Response) => {
    try {
      const { page, recordPerPage, search, userId } = req.query;

      const pageNumber = page ? Number(page) : 1;
      const recordsPerPage = recordPerPage ? Number(recordPerPage) : 10;

      const filter: any = { isDeleted: false, source: { $ne: "fachzubi" } };
      if (search) {
        filter.$or = [
          { companyname: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }

      if (userId) {
        filter.userId = userId;
      }

      const companies = await this.companyService.getAllCompanies(
        filter,
        pageNumber,
        recordsPerPage,
      );
      const totalRecords = await this.companyService.getCount({
        isDeleted: false,
        source: { $ne: "fachzubi" },
      });
      const totalPages = Math.ceil(totalRecords / recordsPerPage);

      res.sendSuccess200Response("Companies retrieved successfully", {
        companies,
        pagination: {
          totalRecords,
          totalPages,
          currentPage: pageNumber,
          pageSize: recordsPerPage,
        },
      });
    } catch (error) {
      logger.error(error);
      res.sendErrorResponse("Error creating company", error);
    }
  };

  public deleteCompany = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const company = await this.companyService.deleteCompany(id);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      res.sendCreated201Response("Company deleted successfully", { company });
    } catch (error) {
      logger.error(error);
      res.sendErrorResponse("Error deleting company", error);
    }
  };

  public getCompanyById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const company = await this.companyService.getCompanyById(id);

      if (!company) {
        res.status(404).json({ error: "Company not found" });
        return;
      }
      res.sendSuccess200Response("Company retrived successfully", company);
    } catch (error) {
      logger.error("getCompanyById", error);
      res.sendErrorResponse("Error updating profile", error);
    }
  };

  public updateCompany = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const loggedInUserEmail = req.user?.email;

      const { newPassword, oldPassword, ...otherProfileFields } = req.body;

      const url = `${process.env.ADMIN_URL}?company=${req.body.companyname}`;

      const company = await this.companyService.updateCompany(
        id,
        newPassword,
        oldPassword,
        otherProfileFields,
      );
      const emailOptions: any = {
        to: req.body.email,
        bcc: loggedInUserEmail,
        subject: "Company Job App – Company Details Updated Successfully",
        html: `
  <div style="font-family: Arial, sans-serif; background-color: #f6f8fa; padding: 24px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 24px; border-radius: 6px;">
      
      <h2 style="color: #333;">Company Details Updated ✅</h2>

      <p style="color: #555; font-size: 14px;">
        This is to inform you that your company information on <strong>Company Job App</strong> has been updated successfully.
      </p>

      <h3 style="color: #333; margin-top: 24px;">Updated Company Details</h3>

      <table style="width: 100%; font-size: 14px; color: #555;">
        <tr>
          <td style="padding: 6px 0;"><strong>Company Name:</strong></td>
          <td>${req.body.companyname}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0;"><strong>Admin Panel URL:</strong></td>
          <td>
            <a href="${url}" style="color: #1a73e8;">${url}</a>
          </td>
        </tr>
        ${req.body.password
            ? `
        <tr>
          <td style="padding: 6px 0;"><strong>Updated Password:</strong></td>
          <td>${req.body.password}</td>
        </tr>`
            : ""
          }
      </table>

      <p style="margin-top: 20px; font-size: 14px; color: #555;">
        🔒 If your password was changed, we recommend updating it again after logging in for security purposes.
      </p>

      <p style="margin-top: 24px; font-size: 14px; color: #555;">
        If you did not request this update or notice any incorrect details, please contact our support team immediately.
      </p>

      <p style="margin-top: 32px; font-size: 14px; color: #555;">
        Best regards,<br>
        <strong>Company Job App Team</strong>
      </p>

    </div>
  </div>
  `,
      };

      await emailService.sendEmail(emailOptions);
      res.sendSuccess200Response("Company updated successfully", company);
    } catch (error) {
      logger.error("updateCompany", error);
      res.sendErrorResponse("Error updating profile", error);
    }
  };
}
export default CompanyController;
