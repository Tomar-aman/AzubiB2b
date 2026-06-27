import { type Request, type Response } from "express";
import { SideMenuService } from "./sidemenu.service";
import logger from "../../utils/logger";
import { UploadImage } from "../../utils/uploadImage";

class SideMenuController {
  private readonly sideMenuService: SideMenuService;
  private readonly uploadImage: UploadImage;

  constructor() {
    this.sideMenuService = new SideMenuService();
    this.uploadImage = new UploadImage();
  }

  public addSideMenu = async (req: Request, res: Response) => {
    try {
      const companyId = (req as any).admin._id;
      const { name, url, icon, color, jobAlarm, tips, regionWahlen } = req.body;

      const newSideMenu = await this.sideMenuService.add({
        createdBy: companyId,
        name,
        url,
        icon,
        color,
        jobAlarm,
        tips,
        regionWahlen,
      });

      res.sendCreated201Response("Sidemenu added successfully", newSideMenu);
    } catch (error) {
      logger.error("sidemenu", error);
      res.sendErrorResponse("Error adding sidemenu", error);
    }
  };

  public getSideMenuById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const sideMenu = await this.sideMenuService.getSideMenuById(id);
      if (!sideMenu) {
        res.sendNotFound404Response("Sidemenu not found", null);
        return;
      }

      res.sendSuccess200Response("Sidemenu retrieved successfully", sideMenu);
    } catch (error) {
      logger.error("Sidemenu", error);
      res.sendErrorResponse("Error retrieving sidemenu", error);
    }
  };

  public updateSideMenuById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, url, color } = req.body;
      const files: any = req.files?.icon;
      const updateData: any = {
        name,
        url,
        color,
      };
      if (files) {
        updateData.icon = await this.uploadImage.uploadImage(
          files,
          "public/sidemenu/",
        );
      }
      const updatedSideMenu = await this.sideMenuService.updateSideMenuById(
        id,
        updateData,
      );

      res.sendSuccess200Response(
        "Sidemenu updated successfully",
        updatedSideMenu,
      );
    } catch (error) {
      logger.error("updateSideMenuById", error);
      res.sendErrorResponse("Error updating sidemenu", error);
    }
  };

  public getAllSideMenusForApp = async (req: Request, res: Response) => {
    try {
      const pageNo: any = req.query.pageNo ?? "1";
      const recordPerPage: any = req.query.recordPerPage ?? "10";
      const search: any = req.query.search ?? "";

      const sideMenus = await this.sideMenuService.getAllSideMenusForApp(
        pageNo,
        recordPerPage,
        search,
      );

      res.sendSuccess200Response("Sidemenu retrieved successfully", sideMenus);
    } catch (error) {
      logger.error("getAllSideMenus", error);
      res.sendErrorResponse("Error retrieving sidemenu", error);
    }
  };

  public deleteSideMenuById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedSideMenu = await this.sideMenuService.deleteSideMenuById(id);

      res.sendSuccess200Response(
        "Sidemenu deleted successfully",
        deletedSideMenu,
      );
    } catch (error) {
      res.sendErrorResponse("Error deleting sidemenu", error);
    }
  };
}

export default SideMenuController;
