import { type Request, type Response } from "express";
import logger from "../../utils/logger";
import { JobAlarmContentService } from "./jobAlarmContent.service";
import { UploadImage } from "../../utils/uploadImage";

class JobAlarmContentController {
    private readonly jobAlarmContentService: JobAlarmContentService;
    private readonly uploadImage: UploadImage;

    constructor() {
        this.jobAlarmContentService = new JobAlarmContentService();
        this.uploadImage = new UploadImage();
    }

    public jobAlarmContent = async (req: Request, res: Response) => {
        try {
            // const userId = req.user?.id;

            // if (!userId) {
            //     res.status(404).json({ error: "Unauthorized" });
            //     return;
            // }

            const files: any = req.files?.image;
            const { text, heading } = req.body;
            const data: any = {
                // userId,
                text,
                heading
            }

            if (files) {
                data.image = await this.uploadImage.uploadImage(
                    files,
                    "public/job-alarm/"
                );
            }

            const content = await this.jobAlarmContentService.jobAlarmContent(data);
            res.sendSuccess200Response(
                "Content updated successfully",
                content,
            );
        } catch (error: any) {
            logger.error("jobAlarmContent", error);
            res.sendErrorResponse("Error in jobAlarmContent", error);
        }
    };

    public getJobAlarmContent = async (_: Request, res: Response) => {
        try {
            const content = await this.jobAlarmContentService.getJobAlarmContent();
            res.sendSuccess200Response("Job Alarm content retrieved successfully", content);
        } catch (error) {
            logger.error("getJobAlarmContent", error);
            res.sendErrorResponse("Error retrieving content", error);
        }
    };

    public getJobAlarmContentForApp = async (_: Request, res: Response) => {
        try {
            const content = await this.jobAlarmContentService.getJobAlarmContentForApp();
            res.sendSuccess200Response("Job Alarm content retrieved successfully", content);
        } catch (error) {
            logger.error("getJobAlarmContent", error);
            res.sendErrorResponse("Error retrieving content", error);
        }
    };
};

export default JobAlarmContentController;