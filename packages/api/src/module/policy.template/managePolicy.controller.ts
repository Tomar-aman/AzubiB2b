import { type Request, type Response } from "express";
import logger from "../../utils/logger";
import { PolicyService } from "./managePolicy.service";

class PolicyController {
  private readonly policyService: PolicyService;
  constructor() {
    this.policyService = new PolicyService();
  }

  public policyContent = async (req: Request, res: Response) => {
    try {
      // const userId = req.user?.id;

      // if (!userId) {
      //   res.status(404).json({ error: "Unauthorized" });
      //   return;
      // }

      const { description } = req.body;
      const data: any = {
        // userId,
        description,
      };

      const privacyContent = await this.policyService.policyContent(data);
      res.sendSuccess200Response(
        "Privacy policy added successfully",
        privacyContent,
      );
    } catch (error) {
      console.log(error);
      logger.error("privacyContent", error);
      res.sendErrorResponse("Error in privacyContent", error);
    }
  };

  public getPolicy = async (_: Request, res: Response) => {
    try {
      const content = await this.policyService.getPolicy();
      res.sendSuccess200Response("Policy retrieved successfully", content);
    } catch (error) {
      logger.error("getPolicy", error);
      res.sendErrorResponse("Error retrieving content", error);
    }
  };

  public getPolicyForApp = async (_: Request, res: Response) => {
    try {
      const content = await this.policyService.getPolicyForApp();
      res.sendSuccess200Response("Policy retrieved successfully", content);
    } catch (error) {
      logger.error("getPolicy", error);
      res.sendErrorResponse("Error retrieving content", error);
    }
  };
}

export default PolicyController;
