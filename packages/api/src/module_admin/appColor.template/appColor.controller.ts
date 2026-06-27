import { type Request, type Response } from "express";
import logger from "../../utils/logger";
import { AppColorService } from "./appColor.service";

class AppColorController {
  private readonly appColorService: AppColorService;

  constructor() {
    this.appColorService = new AppColorService();
  }

  public appColorContent = async (req: Request, res: Response) => {
    try {
      const { headingOneColor, headingTwoColor, manageEmail, manageSavedJob } =
        req.body;
      const data: any = {
        headingOneColor,
        headingTwoColor,
        manageEmail,
        manageSavedJob,
      };
      const colorContent = await this.appColorService.appColorContent(data);
      res.sendSuccess200Response(
        "Color content add successfully",
        colorContent,
      );
    } catch (error) {
      logger.error("appColorContent", error);
      res.sendErrorResponse("Error in appColorContent", error);
    }
  };

  public getAppColorContent = async (_: Request, res: Response) => {
    try {
      const content = await this.appColorService.getAppColorContent();
      res.sendSuccess200Response("Content retrieved successfully", content);
    } catch (error) {
      logger.error("getAppColorContent", error);
      res.sendErrorResponse("Error retrieving content", error);
    }
  };
}

export default AppColorController;
