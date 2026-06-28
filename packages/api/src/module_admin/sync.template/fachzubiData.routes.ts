import express from "express";
import SyncController from "./sync.controller";
import AuthMiddleware from "../../middleware/authMiddleware";

const fachzubiDataRoute = express.Router();
const syncController = new SyncController();
const authMiddleware = new AuthMiddleware();

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

export default fachzubiDataRoute;
