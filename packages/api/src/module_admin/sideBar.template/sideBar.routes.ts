import express from "express";
import AdminAuthMiddleware from "../../middleware/adminAuthMiddleware";
import SideBarContentController from "./sideBar.controller";

const sideBarContentRoute = express.Router();
const sideBarContentController = new SideBarContentController();
const adminAuthMiddleware = new AdminAuthMiddleware();

// Side bar content
sideBarContentRoute.put(
  "/add-sidebar-content",
  adminAuthMiddleware.verifyToken,
  sideBarContentController.sideBarContent,
);

sideBarContentRoute.get(
  "/get-sidebar-content",
  adminAuthMiddleware.verifyToken,
  sideBarContentController.getSideBarContent,
);

// Side bar content for app
sideBarContentRoute.get(
  "/sidebar-content",
  sideBarContentController.getSideBarContent,
);

// Tips content
sideBarContentRoute.put(
  "/add-tips-content",
  adminAuthMiddleware.verifyToken,
  sideBarContentController.tipsContent,
);

sideBarContentRoute.get(
  "/get-tips-content",
  adminAuthMiddleware.verifyToken,
  sideBarContentController.getTipsContent,
);

// Alarm content
sideBarContentRoute.put(
  "/add-alarm-content",
  adminAuthMiddleware.verifyToken,
  sideBarContentController.alarmContent,
);

sideBarContentRoute.get(
  "/get-alarm-content",
  adminAuthMiddleware.verifyToken,
  sideBarContentController.getAlarmContent,
);

export default sideBarContentRoute;
