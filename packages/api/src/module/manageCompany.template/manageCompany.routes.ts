import express from "express";
import ManageCompanyController from "./manageCompany.controller";
import AuthMiddleware from "../../middleware/authMiddleware";

const manageCompanyRoute = express.Router();
const manageCompanyController = new ManageCompanyController();
const authMiddleware = new AuthMiddleware();

manageCompanyRoute.get(
  "/manage-company/:id",
  authMiddleware.protect,
  manageCompanyController.getManageCompanyById,
);

manageCompanyRoute.put(
  "/manage-company/:id",
  authMiddleware.protect,
  manageCompanyController.updateManageCompany,
);

manageCompanyRoute.post(
  "/add-city",
  authMiddleware.protect,
  manageCompanyController.addCity,
);

manageCompanyRoute.get(
  "/all-cities/:id",
  authMiddleware.protect,
  manageCompanyController.getCompanyCities,
);

manageCompanyRoute.patch(
  "/city-status/:id",
  authMiddleware.protect,
  manageCompanyController.updateCityStatus,
);

export default manageCompanyRoute;
