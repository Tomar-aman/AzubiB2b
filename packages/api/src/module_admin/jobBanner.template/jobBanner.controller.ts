import { type Request, type Response } from "express";
import logger from "../../utils/logger";
import { JobBannerService } from "./jobBanner.service";
import { UploadImage } from "../../utils/uploadImage";

class JobBannerController {
  private readonly jobBannerService: JobBannerService;
  private readonly uploadImage: UploadImage;

  constructor() {
    this.jobBannerService = new JobBannerService();
    this.uploadImage = new UploadImage();
  }

  public createBanner = async (req: Request, res: Response) => {
    try {
      const id = (req as any).admin.id;
      const files: any = req.files?.bannerImages;
      const payload = req.body;

      payload.companyId = id;

      if (files) {
        payload.images = await this.uploadImage.uploadImage(
          files,
          "public/banner/",
        );
      }

      if (req.body.addLine) {
        if (typeof req.body.addLine === "string") {
          payload.addLine = [{ text: req.body.addLine }];
        } else if (Array.isArray(req.body.addLine)) {
          payload.addLine = req.body.addLine.map((line: string) => ({
            text: line,
          }));
        } else {
          payload.addLine = [];
        }
      }

      if (req.body.industryName) {
        payload.industry = req.body.industryName;
      }

      if (req.body.jobType) {
        payload.jobType = req.body.jobType;
      }

      if (req.body.code) {
        payload.embeddedCode = req.body.code;
      }

      if (req.body.city) {
        payload.city = req.body.city;
      }

      const banners = await this.jobBannerService.createBanner(req.body);
      res.sendSuccess200Response("banners create successfully", banners);
      return banners;
    } catch (error) {
      logger.error("createBanner", error);
      res.sendErrorResponse("Error creating banner", error);
    }
  };

  public deleteBannerById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedBanner = await this.jobBannerService.deleteBannerById(id);

      if (!deletedBanner) {
        res.sendNotFound404Response("City not found", null);
        return;
      }

      res.sendSuccess200Response("Banner deleted successfully", deletedBanner);
      return deletedBanner;
    } catch (error) {
      logger.error("deleteBannerById", error);
      res.sendErrorResponse("Error deleting job banner", error);
    }
  };

  public updateBannerById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { ...otherFields } = req.body;
      const files: any = req.files?.bannerImages;

      if (files) {
        otherFields.images = await this.uploadImage.uploadImage(
          files,
          "public/banner/",
        );
      }
      if (otherFields.job) {
        // eslint-disable-next-line no-self-assign
        otherFields.job = otherFields.job;
        otherFields.jobUrl = "";
      }
      if (otherFields.jobUrl) {
        // eslint-disable-next-line no-self-assign
        otherFields.jobUrl = otherFields.jobUrl;
        otherFields.job = null;
      }
      if (!otherFields.jobUrl && !otherFields.job) {
        otherFields.jobUrl = "";
        otherFields.job = null;
      }
      if (otherFields.addLine) {
        if (typeof otherFields.addLine === "string") {
          otherFields.addLine = [{ text: otherFields.addLine }]; // Convert single string to array
        } else if (Array.isArray(otherFields.addLine)) {
          otherFields.addLine = otherFields.addLine.map((line: string) => ({
            text: line,
          }));
        }
      }

      if (otherFields.industryName) {
        otherFields.industry = otherFields.industryName;
      }

      if (otherFields.code) {
        otherFields.embeddedCode = otherFields.code;
      }

      const banners = await this.jobBannerService.updateBannerById(
        id,
        otherFields,
      );

      res.sendSuccess200Response("Banners update successfully", banners);
      return banners;
    } catch (error) {
      logger.error("updateBannerById", error);
      res.sendErrorResponse("Error updating job banner", error);
    }
  };

  public getAllBanners = async (req: Request, res: Response) => {
    try {
      const { searchValue, recordPerPage } = req.query;
      const companyId = (req as any).admin.id;

      const banners = await this.jobBannerService.getAllBanners({
        searchValue,
        recordPerPage: Number(recordPerPage),
        companyId,
      });

      res.sendSuccess200Response("Banners retrieved successfully", banners);
    } catch (error) {
      logger.error("getAllBanners", error);
      res.sendErrorResponse("error code 102", error);
    }
  };

  public getBannerById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const banner = await this.jobBannerService.getBannerById(id);

    if (!banner) {
      res.sendNotFound404Response("Banner not found", null);
      return;
    }

    res.sendSuccess200Response("Banners retrieved successfully", banner);
  };

  // For app
  public getAllBannersForApp = async (req: Request, res: Response) => {
    try {
      const {
        searchValue,
        industry,
        recordPerPage,
        selectedCities,
        jobType,
        companyId,
      } = req.query;

      const banners = await this.jobBannerService.getAllBannersForApp({
        searchValue,
        industry: industry ? JSON.parse(industry as any) : "",
        recordPerPage: Number(recordPerPage),
        selectedCities: selectedCities ? JSON.parse(selectedCities as any) : "",
        jobType: jobType ? JSON.parse(jobType as any) : "",
        companyId,
      });

      res.sendSuccess200Response("Banners retrieved successfully", banners);
    } catch (error) {
      logger.error("getAllBanners", error);
      res.sendErrorResponse("error code 102", error);
    }
  };
}

export default JobBannerController;
