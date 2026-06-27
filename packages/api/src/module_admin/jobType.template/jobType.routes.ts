import express from "express";
import AdminAuthMiddleware from "../../middleware/adminAuthMiddleware";
import JobTypesController from "./jobType.controller";

const jobTypesRoute = express.Router();
const jobTypesController = new JobTypesController();
const adminAuthMiddlewar = new AdminAuthMiddleware();

jobTypesRoute.post(
  "/job-type",
  // adminAuthMiddlewar.verifyToken,
  jobTypesController.addJobType,
);

jobTypesRoute.get(
  "/job-type/:id",
  // adminAuthMiddlewar.verifyToken,
  jobTypesController.getJobTypeById,
);

jobTypesRoute.put(
  "/job-type/:id",
  adminAuthMiddlewar.verifyToken,
  jobTypesController.updateJobTypeById,
);

jobTypesRoute.delete(
  "/job-type/:id",
  adminAuthMiddlewar.verifyToken,
  jobTypesController.deleteJobTypeById,
);

jobTypesRoute.get(
  "/all-job-types",
  // adminAuthMiddlewar.verifyToken,
  jobTypesController.getAllJobTypes,
);

// For app --
jobTypesRoute.get("/job-types", jobTypesController.getAllJobTypesForApp);
export default jobTypesRoute;
