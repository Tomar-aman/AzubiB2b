import { type Request, type Response } from "express";
import logger from "../../utils/logger";
import { UploadImage } from "../../utils/uploadImage";
import { SideBarContentService } from "./sideBar.service";

class SideBarContentController {
  private readonly sideBarContentService: SideBarContentService;
  private readonly uploadImage: UploadImage;
  constructor() {
    this.sideBarContentService = new SideBarContentService();
    this.uploadImage = new UploadImage();
  }

  // Side bar content
  public sideBarContent = async (req: Request, res: Response) => {
    try {
      const file: any = req.files?.logo;

      const data: any = {};

      if (file) {
        data.logo = await this.uploadImage.uploadImage(
          file,
          "public/sidebarlogo/",
        );
      }

      const sideMenuContent =
        await this.sideBarContentService.sideBarContent(data);

      res.sendSuccess200Response(
        "Side bar content add successfully",
        sideMenuContent,
      );
    } catch (error) {
      logger.error("sideBarContent", error);
      res.sendErrorResponse("Error in sideBarContent", error);
    }
  };

  public getSideBarContent = async (_: Request, res: Response) => {
    try {
      const content = await this.sideBarContentService.getSideBarContent();
      res.sendSuccess200Response("Content retrieved successfully", content);
    } catch (error) {
      logger.error("getSideMenuContent", error);
      res.sendErrorResponse("Error retrieving content", error);
    }
  };

  // Manage Tips
  public tipsContent = async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;

      const data: any = {
        name,
        description,
      };

      const sideMenuContent =
        await this.sideBarContentService.tipsContent(data);

      res.sendSuccess200Response(
        "Alarm content add successfully",
        sideMenuContent,
      );
    } catch (error) {
      logger.error("sideMenuContent", error);
      res.sendErrorResponse("Error in sideMenuContent", error);
    }
  };

  public getTipsContent = async (_: Request, res: Response) => {
    try {
      const content = await this.sideBarContentService.getTipsContent();
      res.sendSuccess200Response("Content retrieved successfully", content);
    } catch (error) {
      logger.error("getSideMenuContent", error);
      res.sendErrorResponse("Error retrieving content", error);
    }
  };

  // Manage Alarm
  public alarmContent = async (req: Request, res: Response) => {
    try {
      const { lineOne, lineTwo } = req.body;
      const file: any = req.files?.logo;

      const data: any = {
        lineOne,
        lineTwo,
      };

      if (file) {
        data.logo = await this.uploadImage.uploadImage(
          file,
          "public/alarmLogo/",
        );
      }

      const sideMenuContent =
        await this.sideBarContentService.alarmContent(data);

      res.sendSuccess200Response(
        "Alarm content add successfully",
        sideMenuContent,
      );
    } catch (error) {
      logger.error("sideMenuContent", error);
      res.sendErrorResponse("Error in sideMenuContent", error);
    }
  };

  public getAlarmContent = async (_: Request, res: Response) => {
    try {
      const content = await this.sideBarContentService.getAlarmContent();
      res.sendSuccess200Response("Content retrieved successfully", content);
    } catch (error) {
      logger.error("getSideMenuContent", error);
      res.sendErrorResponse("Error retrieving content", error);
    }
  };
}

export default SideBarContentController;
