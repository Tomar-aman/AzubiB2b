import express from "express";
import AdminAuthMiddleware from "../../middleware/adminAuthMiddleware";
import NotificationController from "./notification.controller";

const notificationRoute = express.Router();
const notificationController = new NotificationController();
const adminAuthMiddlewar = new AdminAuthMiddleware();

notificationRoute.get("/device-token", notificationController.getDeviceToken);

notificationRoute.post(
  "/notification",
  adminAuthMiddlewar.verifyToken,
  notificationController.createNotification,
);

notificationRoute.get(
  "/get-notifications",
  adminAuthMiddlewar.verifyToken,
  notificationController.getAllNotifications,
);
export default notificationRoute;
