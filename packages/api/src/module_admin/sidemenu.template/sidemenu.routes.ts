import express from "express";
import AdminAuthMiddleware from "../../middleware/adminAuthMiddleware";
import SideMenuController from "./sidemenu.controller";

const sideMenuRoute = express.Router();
const adminAuthMiddlewar = new AdminAuthMiddleware();
const sideMenuController = new SideMenuController();

sideMenuRoute.post(
  "/sidemenu",
  adminAuthMiddlewar.verifyToken,
  sideMenuController.addSideMenu,
);

sideMenuRoute.get(
  "/sidemenu/:id",
  // adminAuthMiddlewar.verifyToken,
  sideMenuController.getSideMenuById,
);

sideMenuRoute.put(
  "/sidemenu/:id",
  adminAuthMiddlewar.verifyToken,
  sideMenuController.updateSideMenuById,
);

sideMenuRoute.get(
  "/sidemenus",
  // adminAuthMiddlewar.verifyToken,
  sideMenuController.getAllSideMenusForApp,
);

sideMenuRoute.delete(
  "/sidemenu/:id",
  adminAuthMiddlewar.verifyToken,
  sideMenuController.deleteSideMenuById,
);

export default sideMenuRoute;
