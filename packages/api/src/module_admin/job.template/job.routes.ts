import express from "express";
import JobController from "./job.controller";
import AdminAuthMiddleware from "../../middleware/adminAuthMiddleware";

const jobRoute = express.Router();
const jobController = new JobController();
const adminAuthMiddlewar = new AdminAuthMiddleware();

jobRoute.post("/add-job",
  //  adminAuthMiddlewar.verifyToken,
  jobController.addJob);

jobRoute.delete(
  "/delete-job/:id",
  // adminAuthMiddlewar.verifyToken,
  jobController.deleteJobById,
);

jobRoute.delete(
  "/delete-job-file/:id",
  adminAuthMiddlewar.verifyToken,
  jobController.deleteJobImagesById,
);

jobRoute.patch(
  "/restore-job/:id",
  adminAuthMiddlewar.verifyToken,
  jobController.restoreJobById,
);

jobRoute.get(
  "/deleted-jobs",
  adminAuthMiddlewar.verifyToken,
  jobController.getDeletedJobs,
);

jobRoute.put(
  "/job-status/:id",
  adminAuthMiddlewar.verifyToken,
  jobController.updateStatus,
);

jobRoute.put(
  "/job/:id",
  // adminAuthMiddlewar.verifyToken,
  jobController.updateJobById,
);

jobRoute.get(
  "/all-jobs",
  // adminAuthMiddlewar.verifyToken,
  jobController.getAllJobs,
);

jobRoute.get(
  "/get-job/:id",
  // adminAuthMiddlewar.verifyToken,
  jobController.getJobById,
);

// For App
jobRoute.get("/jobs", jobController.getAllJobsForApp);

jobRoute.get("/job/:id", jobController.getJobByIdForApp);

export default jobRoute;
