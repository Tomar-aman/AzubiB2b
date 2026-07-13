import express from "express";
import SyncController from "./sync.controller";
import AuthMiddleware from "../../middleware/authMiddleware";

const fachzubiDataRoute = express.Router();
const syncController = new SyncController();
const authMiddleware = new AuthMiddleware();

fachzubiDataRoute.post(
  "/fachzubi-upload",
  authMiddleware.protect,
  syncController.uploadFachzubiFiles,
);

fachzubiDataRoute.get(
  "/fachzubi-companies",
  authMiddleware.protect,
  syncController.getFachzubiCompanies,
);

fachzubiDataRoute.get(
  "/fachzubi-jobs",
  authMiddleware.protect,
  syncController.getFachzubiJobs,
);

fachzubiDataRoute.get(
  "/fachzubi-job/:id",
  authMiddleware.protect,
  syncController.getFachzubiJobById,
);

fachzubiDataRoute.patch(
  "/fachzubi-job/:id/status",
  authMiddleware.protect,
  syncController.toggleJobStatus,
);

fachzubiDataRoute.put(
  "/fachzubi-job/:id",
  authMiddleware.protect,
  syncController.updateFachzubiJob,
);

fachzubiDataRoute.delete(
  "/fachzubi-job/:id",
  authMiddleware.protect,
  syncController.deleteFachzubiJobById,
);

fachzubiDataRoute.get(
  "/fachzubi-company/:id",
  authMiddleware.protect,
  syncController.getFachzubiCompanyById,
);

fachzubiDataRoute.patch(
  "/fachzubi-company/:id/status",
  authMiddleware.protect,
  syncController.toggleCompanyStatus,
);

fachzubiDataRoute.put(
  "/fachzubi-company/:id",
  authMiddleware.protect,
  syncController.updateFachzubiCompany,
);

fachzubiDataRoute.delete(
  "/fachzubi-company/:id",
  authMiddleware.protect,
  syncController.deleteFachzubiCompanyById,
);

export default fachzubiDataRoute;
