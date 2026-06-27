import { type Request, type Response } from "express";
import { UploadImage } from "../../utils/uploadImage";
import { IconService } from "./icon.service";
import logger from "../../utils/logger";

class IconController {
  private readonly iconService: IconService;
  private readonly uploadImage: UploadImage;

  constructor() {
    this.iconService = new IconService();
    this.uploadImage = new UploadImage();
  }

  public addIcon = async (req: Request, res: Response) => {
    try {
      const file: any = req.files?.icon;

      const data: any = {};

      if (file) {
        data.icon = await this.uploadImage.uploadImage(file, "public/icon/");
      }

      const icon = await this.iconService.addIcon(data);

      res.sendSuccess200Response("Icon add successfully", icon);
    } catch (error) {
      logger.error("Icon", error);
      res.sendErrorResponse("Error in adding icon", error);
    }
  };

  public getIcons = async (_: Request, res: Response) => {
    try {
      const icons = await this.iconService.getIcons();
      res.sendSuccess200Response("Icons retrieved successfully", icons);
    } catch (error) {
      logger.error("getIcons", error);
      res.sendErrorResponse("Error retrieving icon", error);
    }
  };

  public deleteIconsById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedNews =
        await this.iconService.deleteIconsById(id);

      res.sendSuccess200Response(
        "Icons deleted successfully",
        deletedNews,
      );
    } catch (error) {
      logger.error("deleteIconsById", error);
      res.sendErrorResponse("Error deleting icons", error);
    }
  };
}

export default IconController;
