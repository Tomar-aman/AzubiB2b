import express from "express";
import AdminAuthMiddleware from "../../middleware/adminAuthMiddleware";
import IconController from "./icon.controller";

const iconRoute = express.Router();
const iconController = new IconController();
const adminAuthMiddlewar = new AdminAuthMiddleware();

iconRoute.post(
  "/add-icon",
  adminAuthMiddlewar.verifyToken,
  iconController.addIcon,
);

iconRoute.get(
  "/get-icons",
  // adminAuthMiddlewar.verifyToken,
  iconController.getIcons,
);

iconRoute.delete(
  "/delete-icons/:id",
  adminAuthMiddlewar.verifyToken,
  iconController.deleteIconsById,
);

export default iconRoute;
