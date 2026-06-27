import { type Request, type Response } from "express";
import logger from "../../utils/logger";
import { MeineDatenService } from "./meineDaten.service";

class MeineDatenController {
    private readonly meineDatenService: MeineDatenService;
    constructor() {
        this.meineDatenService = new MeineDatenService();
    }

    public meineDatenContent = async (req: Request, res: Response) => {
        try {
            // const userId = req.user?.id;

            // if (!userId) {
            //     res.status(404).json({ error: "Unauthorized" });
            //     return;
            // }

            const { text } = req.body;
            const data: any = {
                // userId,
                text,
            };

            const content = await this.meineDatenService.meineDatenContent(data);
            res.sendSuccess200Response(
                "Meine daten content added successfully",
                content,
            );
        } catch (error) {
            console.log(error);
            logger.error("meineDatenContent", error);
            res.sendErrorResponse("Error in meineDatenContent", error);
        }
    };

    public getContent = async (_: Request, res: Response) => {
        try {
            const content = await this.meineDatenService.getContent();
            res.sendSuccess200Response("Meine daten content retrieved successfully", content);
        } catch (error) {
            logger.error("getMeineDaten", error);
            res.sendErrorResponse("Error retrieving content", error);
        }
    };

    public getContentForApp = async (_: Request, res: Response) => {
        try {
            const content = await this.meineDatenService.getContentForApp();
            res.sendSuccess200Response("Meine daten content retrieved successfully", content);
        } catch (error) {
            logger.error("getContent", error);
            res.sendErrorResponse("Error retrieving content", error);
        }
    };
};

export default MeineDatenController;