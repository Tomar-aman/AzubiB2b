import express from "express";
import ApplicationController from "./application.controller";
import AdminAuthMiddleware from "../../middleware/adminAuthMiddleware";

const route = express.Router();
const controller = new ApplicationController();
const adminAuth = new AdminAuthMiddleware();
const routeName: string = "/application";

route.post(routeName, controller.add);

route.get(routeName + "/:id", controller.getById);

route.put(routeName + "/:id", adminAuth.verifyToken, controller.updateById);

route.get(routeName + "s", controller.getAll);

route.delete(routeName + "/:id", controller.deleteById);

route.delete(routeName + "-file/:id", controller.deleteFileById);

// Admin
route.get(
  "/all-applications",
  adminAuth.verifyToken,
  controller.getAllForAdmin,
);

route.get(
  "/applications/:id",
  adminAuth.verifyToken,
  controller.getByIdForAdmin,
);

const applicationRoute = route;

export default applicationRoute;
