import { type Request, type Response } from "express";
import logger from "../../utils/logger";
import { ImpressumService } from "./manageImpressum.service";

class ImpressumController {
    private readonly impressumService: ImpressumService;
    constructor() {
        this.impressumService = new ImpressumService();
    }

    public impressumContent = async (req: Request, res: Response) => {
        try {
            const { description } = req.body;
            const data: any = { description };

            const impressumContent = await this.impressumService.impressumContent(data);
            res.sendSuccess200Response(
                "Impressum added successfully",
                impressumContent,
            );
        } catch (error) {
            console.log(error);
            logger.error("impressumContent", error);
            res.sendErrorResponse("Error in impressumContent", error);
        }
    };

    public getImpressum = async (_: Request, res: Response) => {
        try {
            const content = await this.impressumService.getImpressum();
            res.sendSuccess200Response("Impressum retrieved successfully", content);
        } catch (error) {
            logger.error("getImpressum", error);
            res.sendErrorResponse("Error retrieving content", error);
        }
    };

    public getImpressumForApp = async (_: Request, res: Response) => {
        try {
            const content = await this.impressumService.getImpressumForApp();
            res.sendSuccess200Response("Impressum retrieved successfully", content);
        } catch (error) {
            logger.error("getImpressum", error);
            res.sendErrorResponse("Error retrieving content", error);
        }
    };
}

export default ImpressumController;
