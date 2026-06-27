import express from "express";
import AuthMiddleware from "../../middleware/authMiddleware";
import JobFormContentController from "./jobFormContent.controller";

const jobFormContentRoute = express.Router();
const authMiddleware = new AuthMiddleware();
const jobFormContentController = new JobFormContentController();

jobFormContentRoute.put(
    "/job-form-content",
    authMiddleware.protect,
    jobFormContentController.jobFormContent
);

jobFormContentRoute.get(
    "/get-job-form-content",
    authMiddleware.protect,
    jobFormContentController.getJobFormContent,
);

jobFormContentRoute.get("/job-form-content", jobFormContentController.getJobFormContentForApp);

export default jobFormContentRoute;