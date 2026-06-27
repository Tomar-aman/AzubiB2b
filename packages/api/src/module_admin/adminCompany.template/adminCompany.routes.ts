import express from "express";
import AdminCompanyController from "./adminCompany.controller";
import AdminAuthMiddleware from "../../middleware/adminAuthMiddleware";

const adminCompanyRoute = express.Router();
const adminCompanyController = new AdminCompanyController();
const adminAuthMiddleware = new AdminAuthMiddleware();

adminCompanyRoute.post("/login", adminCompanyController.loginCompanyAdmin);

adminCompanyRoute.get(
  "/company",
  adminAuthMiddleware.verifyToken,
  adminCompanyController.getAdminCompanyById,
);

adminCompanyRoute.get(
  "/manage-company",
  adminAuthMiddleware.verifyToken,
  adminCompanyController.getAdminManageCompanyById,
);

adminCompanyRoute.get(
  "/get-company",
  adminAuthMiddleware.verifyToken,
  adminCompanyController.getCompany,
);

adminCompanyRoute.put(
  "/company",
  adminAuthMiddleware.verifyToken,
  adminCompanyController.updateAdminCompanyById,
);

adminCompanyRoute.delete(
  "/delete-company-images/:id",
  adminAuthMiddleware.verifyToken,
  adminCompanyController.deleteCompanyImagesById,
);

adminCompanyRoute.put(
  "/company-status/:id",
  adminAuthMiddleware.verifyToken,
  adminCompanyController.updateStatus,
);

adminCompanyRoute.get(
  "/all-companies",
  adminAuthMiddleware.verifyToken,
  adminCompanyController.getAllCompanies,
);

adminCompanyRoute.get(
  "/reset-link/:companyName/:email",
  adminCompanyController.getForPasswordLink,
);

adminCompanyRoute.put("/reset-password", adminCompanyController.resetPassword);

adminCompanyRoute.get(
  "/company/:name",
  adminCompanyController.getCompanyByName,
);

// For-app
adminCompanyRoute.get(
  "/companies",
  adminCompanyController.getAllCompaniesForApp,
);

adminCompanyRoute.get(
  "/company/id/:id",
  adminCompanyController.getCompanyByIdForApp,
);

export default adminCompanyRoute;
