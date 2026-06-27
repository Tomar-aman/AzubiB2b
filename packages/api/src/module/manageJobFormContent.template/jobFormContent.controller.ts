import { type Request, type Response } from "express";
import logger from "../../utils/logger";
import { JobFormContentService } from "./jobFormContent.service";

class JobFormContentController {
    private readonly jobFormContentService: JobFormContentService;

    constructor() {
        this.jobFormContentService = new JobFormContentService();
    }

    public jobFormContent = async (req: Request, res: Response) => {
        try {
            // const userId = req.user?.id;
            // if (!userId) {
            //     res.status(404).json({ error: "Unauthorized" });
            //     return;
            // };

            const { coverLetter } = req.body;
            const data: any = { coverLetter };
            const content = await this.jobFormContentService.jobFormContent(data);
            res.sendSuccess200Response(
                "Content updated successfully",
                content,
            );
        } catch (error) {
            logger.error("jobFormContent", error);
            res.sendErrorResponse("Error in jobFormContent", error);
        }
    };

    public getJobFormContent = async (_: Request, res: Response) => {
        try {
            const content = await this.jobFormContentService.getJobFormContent();
            res.sendSuccess200Response("Job Form content retrieved successfully", content);
        } catch (error) {
            logger.error("getJobFormContent", error);
            res.sendErrorResponse("Error retrieving content", error);
        }
    };

    public getJobFormContentForApp = async (_: Request, res: Response) => {
        try {
            const content = await this.jobFormContentService.getJobFormContentForApp();
            res.sendSuccess200Response("Job Form content retrieved successfully", content);
        } catch (error) {
            logger.error("getJobFormContent", error);
            res.sendErrorResponse("Error retrieving content", error);
        }
    };
};

export default JobFormContentController;