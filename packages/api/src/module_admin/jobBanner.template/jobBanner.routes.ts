import express from "express";
import JobBannerController from "./jobBanner.controller";
import AdminAuthMiddleware from "../../middleware/adminAuthMiddleware";

const jobBannerRoute = express.Router();
const jobBannerController = new JobBannerController();
const adminAuthMiddleware = new AdminAuthMiddleware();

jobBannerRoute.post(
  "/add-job-banner",
  adminAuthMiddleware.verifyToken,
  jobBannerController.createBanner,
);

jobBannerRoute.put(
  "/job-banner/:id",
  adminAuthMiddleware.verifyToken,
  jobBannerController.updateBannerById,
);

jobBannerRoute.delete(
  "/delete-job-banner/:id",
  adminAuthMiddleware.verifyToken,
  jobBannerController.deleteBannerById,
);

jobBannerRoute.get(
  "/all-job-banners",
  adminAuthMiddleware.verifyToken,
  jobBannerController.getAllBanners,
);

jobBannerRoute.get(
  "/get-job-banner/:id",
  adminAuthMiddleware.verifyToken,
  jobBannerController.getBannerById,
);

// For app
jobBannerRoute.get("/job-banners", jobBannerController.getAllBannersForApp);

export default jobBannerRoute;
