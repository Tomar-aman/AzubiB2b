import express from "express";
import CompanyController from "./company.controller";
import AuthMiddleware from "../../middleware/authMiddleware";
import JoiValidator from "../../utils/joiValidator";
import { createCompanyBodyValidator } from "./company.schema";

const companyRoute = express.Router();
const companyController = new CompanyController();
const authMiddleware = new AuthMiddleware();
const joiValidator = new JoiValidator();

companyRoute.post(
  "/create-company",
  authMiddleware.protect,
  joiValidator.validate(createCompanyBodyValidator, "body"),
  companyController.createCompany,
);

companyRoute.get(
  "/companies",
  authMiddleware.protect,
  companyController.getAllCompanies,
);
// companyRoute.patch("/delete-company/:id", companyController.softDelete);

companyRoute.delete(
  "/delete-company/:id",
  authMiddleware.protect,
  companyController.deleteCompany,
);

companyRoute.get(
  "/company/:id",
  authMiddleware.protect,
  companyController.getCompanyById,
);

companyRoute.put(
  "/company/:id",
  authMiddleware.protect,
  companyController.updateCompany,
);

export default companyRoute;
