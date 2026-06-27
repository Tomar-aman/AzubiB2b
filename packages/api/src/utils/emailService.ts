import nodemailer, { type SentMessageInfo } from "nodemailer";
import logger from "./logger";
import { CompanyModel } from "../models";
import { AdminCompanyService } from "../module_admin/adminCompany.template/adminCompany.service";

interface EmailOptions {
  companyId?: string;
  bcc?: string | string[];
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter<SentMessageInfo>;
  private readonly companyService = new AdminCompanyService();
  private fromEmail: any;
  constructor(fromEmail?: any) {
    this.fromEmail = fromEmail ?? "";
  }

  async init() {
    const smtpInfo = await CompanyModel.findOne();
    const options: any = {
      service: process.env.EMAIL_SERVICE || smtpInfo?.smtpService,
      host: process.env.EMAIL_HOST || smtpInfo?.smtpHost,
      tls: {
        rejectUnauthorized: process.env.EMAIL_REJECT_UNAUTHORIZED || false,
      },
      secure: process.env.EMAIL_SECURE || true,
      port: process.env.EMAIL_PORT || smtpInfo?.smtpPort,
      auth: {
        user: process.env.EMAIL_USER || smtpInfo?.smtpUserName,
        pass: process.env.EMAIL_PASS || smtpInfo?.smtpPassword,
      },
    };
    this.transporter = nodemailer.createTransport({
      ...options,
    });
    if (!this.fromEmail) {
      this.fromEmail = process.env.EMAIL_USER || smtpInfo?.smtpAddress;
    }
  }

  async updateFromEmail(fromEmail: string) {
    this.fromEmail = fromEmail;
  }

  async sendEmail(options: EmailOptions) {
    try {
      const { companyId, bcc, to, subject, text, html } = options;
      let transporter = this.transporter;
      let fromEmail = this.fromEmail;
      if (companyId) {
        const companySmtpDetails = await this.companyService.findOneWithOptions(
          { _id: companyId },
        );

        // if (!companySmtpDetails) {
        //   throw new Error("Company not found");
        // }
        if (
          !!companySmtpDetails?.smtpService &&
          !!companySmtpDetails.smtpHost &&
          !!companySmtpDetails.smtpPort &&
          !!companySmtpDetails.smtpUserName &&
          !!companySmtpDetails.smtpPassword
        ) {
          const options = {
            service: companySmtpDetails.smtpService,
            host: companySmtpDetails.smtpHost,
            tls: {
              rejectUnauthorized: false,
            },
            secure: true,
            port: companySmtpDetails.smtpPort,
            auth: {
              user: companySmtpDetails.smtpUserName,
              pass: companySmtpDetails.smtpPassword,
            },
          };
          transporter = nodemailer.createTransport({
            ...options,
          });
        }
        if (companySmtpDetails?.smtpAddress) {
          fromEmail = companySmtpDetails.smtpAddress;
        }
      }

      const mailOptions = {
        from: fromEmail,
        bcc,
        to,
        subject,
        text,
        html,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log({ info, mailOptions })
      // eslint-disable-next-line no-console
      logger.info(`Message sent: ${info.messageId}`);
      return info;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      logger.info(`Fail to send: ${error}`);
    }
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      logger.info("Email Service is up and running 🚀🚀🚀");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      logger.error("Email Service is down ☹️: ", error);
    }
  }
}
const emailService = new EmailService();
export default emailService;
