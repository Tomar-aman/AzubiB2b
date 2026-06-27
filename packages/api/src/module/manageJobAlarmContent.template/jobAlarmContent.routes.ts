import express from "express";
import AuthMiddleware from "../../middleware/authMiddleware";
import JobAlarmContentController from "./jobAlarmContent.controller";

const jobAlarmContentRoute = express.Router();
const authMiddleware = new AuthMiddleware();
const jobAlarmContentController = new JobAlarmContentController();

jobAlarmContentRoute.put(
    "/job-alarm-content",
    authMiddleware.protect,
    jobAlarmContentController.jobAlarmContent
);

jobAlarmContentRoute.get(
    "/get-job-alarm-content",
    authMiddleware.protect,
    jobAlarmContentController.getJobAlarmContent,
);

jobAlarmContentRoute.get("/job-alarm-content", jobAlarmContentController.getJobAlarmContentForApp);


export default jobAlarmContentRoute;