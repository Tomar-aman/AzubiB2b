import express from "express";
import AppColorController from "./appColor.controller";
import AdminAuthMiddleware from "../../middleware/adminAuthMiddleware";

const appColorRoute = express.Router();
const appColorController = new AppColorController();
const adminAuthMiddleware = new AdminAuthMiddleware();

appColorRoute.put(
  "/app-color",
  adminAuthMiddleware.verifyToken,
  appColorController.appColorContent,
);

appColorRoute.get(
  "/get-app-color",
  // adminAuthMiddleware.verifyToken,
  appColorController.getAppColorContent,
);

export default appColorRoute;
