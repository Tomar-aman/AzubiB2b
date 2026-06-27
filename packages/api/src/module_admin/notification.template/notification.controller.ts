import { type Request, type Response } from "express";
import logger from "../../utils/logger";
import { NotificationService } from "./notification.service";
import { DeviceIdModel } from "../../models";
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

// Initialize Firebase Admin SDK with the service account credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
});

class NotificationController {
  private readonly notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  public getDeviceToken = async (req: Request, res: Response) => {
    try {
      const deviceData = req.query;
      const isDeviceToken = await DeviceIdModel.findOne(deviceData);
      if (!isDeviceToken) {
        const deviceToken = await DeviceIdModel.create(deviceData);
        res.sendCreated201Response(
          "Device token retrived successfully",
          deviceToken,
        );
      } else {
        res.sendCreated201Response("Device token already saved", null);
      }
    } catch (error) {
      logger.error("getDeviceToken", error);
      res.sendErrorResponse("Error getting device token", error);
    }
  };

  public createNotification = async (req: Request, res: Response) => {
    try {
      const id = (req as any).admin.id;
      const newNotification = await this.notificationService.createNotification(
        {
          ...req.body,
          companyId: id,
        },
      );
      const { title, body } = req.body;
      const tokens = await DeviceIdModel.find({}, "deviceId");

      if (tokens.length > 0) {
        const deviceTokens = tokens.map((token: any) => token.deviceId);
        // eslint-disable-next-line no-console
        const message = {
          notification: {
            title: title || "New Notification",
            body: body || "You have a new notification.",
          },
          tokens: deviceTokens,
        };

        // Send the message
        await admin.messaging().sendEachForMulticast(message);

        logger.info("Push notification sent successfully");
      }
      res.sendCreated201Response("Notification created", newNotification);
    } catch (error: any) {
      logger.error("createNotification", error);
      res.sendErrorResponse("Error creating notification", error);
    }
  };

  public getAllNotifications = async (req: Request, res: Response) => {
    try {
      const companyId = (req as any).admin.id;
      const notifications = await this.notificationService.getAllNotifications({
        companyId,
      });
      res.sendSuccess200Response(
        "List of notifications retrieved successfully",
        notifications,
      );
    } catch (error) {
      logger.error("getSideMenuContent", error);
      res.sendErrorResponse("Error retrieving notification list", error);
    }
  };
}

export default NotificationController;
