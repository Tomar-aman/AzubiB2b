import { type Request, type Response } from "express";
import logger from "../../utils/logger";
import { PrivacyPolicyContentService } from "./policy.service";

class PrivacyPolicyContentController {
    private readonly privacyPolicyContentService: PrivacyPolicyContentService;
    constructor() {
        this.privacyPolicyContentService = new PrivacyPolicyContentService();
    };

    public privacyPolicyContent = async (req: Request, res: Response) => {
        try {
            const companyId = (req as any).admin.id;
            const { description } = req.body;

            const data: any = {
                companyId,
                description,
            };

            const privacyContent =
                await this.privacyPolicyContentService.privacyPolicyContent(data);

            res.sendSuccess200Response(
                "Privacy policy added successfully",
                privacyContent,
            );
        } catch (error) {
            console.log(error)
            logger.error("privacyContent", error);
            res.sendErrorResponse("Error in privacyContent", error);
        }
    };

    public getPrivacyPolicyContent = async (req: Request, res: Response) => {
        try {
            const companyId = (req as any).admin.id;

            const content = await this.privacyPolicyContentService.getPrivacyPolicyContent({ companyId: companyId });
            res.sendSuccess200Response("Content retrieved successfully", content);
        } catch (error) {
            logger.error("getPrivacyPolicyContent", error);
            res.sendErrorResponse("Error retrieving content", error);
        }
    };

    public getPrivacyPolicyContentForApp = async (req: Request, res: Response) => {
        try {
            const { companyId } = req.params;

            const privacyPolicyContent = await this.privacyPolicyContentService.getPrivacyPolicyContentForApp({ companyId });
            res.sendSuccess200Response("Privacy policy retrieved successfully", privacyPolicyContent);
        } catch (error) {
            logger.error("getPrivacyPolicyContentForApp", error);
            res.sendErrorResponse("Error retrieving privacy policy content", error);
        }
    }
};

export default PrivacyPolicyContentController;