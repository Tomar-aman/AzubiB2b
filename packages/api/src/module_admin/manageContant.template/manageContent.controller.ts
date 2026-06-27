import { type Request, type Response } from "express";
import logger from "../../utils/logger";
import { ManageContentService } from "./manageContent.service";
import { UploadImage } from "../../utils/uploadImage";

class ManageContentController {
  private readonly manageContentService: ManageContentService;
  private readonly uploadImage: UploadImage;

  constructor() {
    this.manageContentService = new ManageContentService();
    this.uploadImage = new UploadImage();
  }

  // apply form content
  public getAllApplyFormContent = async (_, res: Response) => {
    try {
      const content = await this.manageContentService.getAllApplyFormContent();
      res.sendSuccess200Response("Content retrieved successfully", content);
    } catch (error) {
      logger.error("getAllContent", error);
      res.sendErrorResponse("Error retrieving content", error);
    }
  };

  public editApplyFormContent = async (req: Request, res: Response) => {
    try {
      const updatedContent =
        await this.manageContentService.editApplyFormContent(req.body);
      res.sendSuccess200Response("Content edited successfully", updatedContent);
    } catch (error) {
      logger.error("editContent", error);
      res.sendErrorResponse("Error editing content", error);
    }
  };

  // faq content
  public editFaqContent = async (req: Request, res: Response) => {
    const { operation } = req.query;

    try {
      if (operation === "accordion") {
        const payload = req.body;
        const updatedContent = await this.manageContentService.editFaqContent(
          payload,
          operation,
        );
        res.sendSuccess200Response(
          "FAQ Accordion Content  edited successfully",
          updatedContent,
        );
      }
      if (operation === "iconSection") {
        const { image } = req?.files ?? {};
        const payload = req.body;
        if (payload.image === "[object Object]") {
          delete payload.image;
        }
        const updatedContent = await this.manageContentService.editFaqContent(
          {
            data: payload,
            media: { image },
          },
          "iconSection",
        );
        res.sendSuccess200Response(
          "FAQ Icon section Content  edited successfully",
          updatedContent,
        );
      }
      if (operation === "header") {
        const updatedContent = await this.manageContentService.editFaqContent(
          {
            ...req.body,
            ...req.files,
          },
          "header",
        );
        res.sendSuccess200Response(
          "FAQ Header Content  edited successfully",
          updatedContent,
        );
      }
      if (operation === "cards") {
        req.body = { ...req.body, ...req.files };
        const updatedContent = await this.manageContentService.editFaqContent(
          req.body,
          "cards",
        );

        res.sendSuccess200Response(
          "FAQ cards Content  edited successfully",
          updatedContent,
        );
      }

      res.sendErrorResponse("invalid operation value", null);
    } catch (error) {
      logger.error("editContent", error);
      res.sendErrorResponse("Error editing content", error);
    }
  };

  public getAllFAQContent = async (_, res: Response) => {
    try {
      const content = await this.manageContentService.getAllFAQContent();
      res.sendSuccess200Response("FAQ Content retrieved successfully", content);
    } catch (error) {
      logger.error("getAllContent", error);
      res.sendErrorResponse("Error retrieving content", error);
    }
  };

  // about content
  public editAboutContent = async (req: Request, res: Response) => {
    const { operation } = req.query;
    try {
      if (operation === "banner") {
        req.body = { ...req.body, ...req.files };
        const updatedContent = await this.manageContentService.editAboutContent(
          req.body,
          "banner",
        );

        res.sendSuccess200Response(
          "Banner Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "textBlock") {
        const updatedContent = await this.manageContentService.editAboutContent(
          req.body,
          operation,
        );

        res.sendSuccess200Response(
          "Text Block Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "aboutFeature") {
        req.body = { ...req.body, ...req.files };
        const updatedContent = await this.manageContentService.editAboutContent(
          req.body,
          "aboutFeature",
        );

        res.sendSuccess200Response(
          "About Feature Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "marketing") {
        const updatedContent = await this.manageContentService.editAboutContent(
          req.body,
          "marketing",
        );

        res.sendSuccess200Response(
          "About Market Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "youTube") {
        const updatedContent = await this.manageContentService.editAboutContent(
          req.body,
          "youTube",
        );

        res.sendSuccess200Response(
          "About youtube Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "mediaData") {
        const updatedContent = await this.manageContentService.editAboutContent(
          req.body,
          "mediaData",
        );

        res.sendSuccess200Response(
          "About Media Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "calender") {
        const updatedContent = await this.manageContentService.editAboutContent(
          { ...req.body, ...req.files },
          "calender",
        );

        res.sendSuccess200Response(
          "About Calender Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "offerCard") {
        const updatedContent = await this.manageContentService.editAboutContent(
          { ...req.body, ...req.files },
          "offerCard",
        );

        res.sendSuccess200Response(
          "About Offer Card Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "customer") {
        const updatedContent = await this.manageContentService.editAboutContent(
          { ...req.body, ...req.files },
          "customer",
        );

        res.sendSuccess200Response(
          "About customer Card Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "slider") {
        const updatedContent = await this.manageContentService.editAboutContent(
          { ...req.body, ...req.files },
          "slider",
        );

        res.sendSuccess200Response(
          "About Slider Card Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "exhibitor") {
        const updatedContent = await this.manageContentService.editAboutContent(
          { ...req.body, ...req.files },
          "exhibitor",
        );

        res.sendSuccess200Response(
          "About exhibitor Card Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "careerFair") {
        const updatedContent = await this.manageContentService.editAboutContent(
          { ...req.body, ...req.files },
          "careerFair",
        );

        res.sendSuccess200Response(
          "About Career Fair Card Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "contact") {
        const updatedContent = await this.manageContentService.editAboutContent(
          { ...req.body, ...req.files },
          "contact",
        );

        res.sendSuccess200Response(
          "About contact Card Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "twoCards") {
        const updatedContent = await this.manageContentService.editAboutContent(
          { ...req.body, ...req.files },
          operation,
        );

        res.sendSuccess200Response(
          "Card Content edited successfully",
          updatedContent,
        );
      }

      res.sendErrorResponse("invalid operation value", null);
    } catch (error) {
      logger.error("editContent", error);
      res.sendErrorResponse("Error editing content", error);
    }
  };

  public getAllAboutContent = async (_, res: Response) => {
    try {
      const content = await this.manageContentService.getAllAboutContent();
      res.sendSuccess200Response(
        "AboutContent retrieved successfully",
        content,
      );
    } catch (error) {
      logger.error("getAllContent", error);
      res.sendErrorResponse("Error retrieving content", error);
    }
  };

  // contact us content
  public getAllContactUsContent = async (_, res: Response) => {
    try {
      const content = await this.manageContentService.getAllContactUsContent();
      res.sendSuccess200Response(
        "Contact us Content retrieved successfully",
        content,
      );
    } catch (error) {
      logger.error("getAllContent", error);
      res.sendErrorResponse("Error retrieving content", error);
    }
  };

  public editContactUsContent = async (req: Request, res: Response) => {
    const { operation } = req.query;
    try {
      if (operation === "pageHeading") {
        const updatedContent =
          await this.manageContentService.editContactUsContent(
            req.body,
            operation,
          );

        res.sendSuccess200Response(
          "Header Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "addressSection") {
        const updatedContent =
          await this.manageContentService.editContactUsContent(
            req.body,
            operation,
          );

        res.sendSuccess200Response(
          "Address section Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "aboutUs") {
        const updatedContent =
          await this.manageContentService.editContactUsContent(
            { ...req.body, ...req.files },
            operation,
          );

        res.sendSuccess200Response(
          "About us Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "counter") {
        const updatedContent =
          await this.manageContentService.editContactUsContent(
            req.body,
            operation,
          );

        res.sendSuccess200Response(
          "Counter Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "contactCardFirstWithPoints") {
        const updatedContent =
          await this.manageContentService.editContactUsContent(
            { ...req.body, ...req.files },
            operation,
          );

        res.sendSuccess200Response(
          "Card with point Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "ContactCardSecond") {
        const updatedContent =
          await this.manageContentService.editContactUsContent(
            { ...req.body, ...req.files },
            operation,
          );

        res.sendSuccess200Response(
          "Card second Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "aboutTeam") {
        const updatedContent =
          await this.manageContentService.editContactUsContent(
            { ...req.body, ...req.files },
            operation,
          );

        res.sendSuccess200Response(
          "About team Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "contactForm") {
        const updatedContent =
          await this.manageContentService.editContactUsContent(
            req.body,
            operation,
          );

        res.sendSuccess200Response(
          "Contact Form Content edited successfully",
          updatedContent,
        );
      }

      res.sendErrorResponse("invalid operation value", null);
    } catch (error) {
      logger.error("editContent", error);
      res.sendErrorResponse("Error editing content", error);
    }
  };

  // home page dynamic content v2
  public editHomePageV2Content = async (req: Request, res: Response) => {
    const { operation } = req.query;
    try {
      if (operation === "cardSection") {
        const updatedContent =
          await this.manageContentService.editHomePageV2Content(
            { ...req.body, ...req.files },
            operation,
          );

        res.sendSuccess200Response(
          "Card Content edited successfully",
          updatedContent,
        );
      }
      if (operation === "youtubeSection") {
        const updatedContent =
          await this.manageContentService.editHomePageV2Content(
            req.body,
            operation,
          );

        res.sendSuccess200Response("edited successfully", updatedContent);
      }
      if (operation === "searchBar") {
        const updatedContent =
          await this.manageContentService.editHomePageV2Content(
            req.body,
            operation,
          );

        res.sendSuccess200Response("edited successfully", updatedContent);
      }
      if (operation === "topState") {
        const updatedContent =
          await this.manageContentService.editHomePageV2Content(
            req.body,
            operation,
          );

        res.sendSuccess200Response("edited successfully", updatedContent);
      }
      if (operation === "federalState") {
        const updatedContent =
          await this.manageContentService.editHomePageV2Content(
            req.body,
            operation,
          );

        res.sendSuccess200Response("edited successfully", updatedContent);
      }
      if (operation === "gallery") {
        const updatedContent =
          await this.manageContentService.editHomePageV2Content(
            req.body,
            operation,
          );

        res.sendSuccess200Response("edited successfully", updatedContent);
      }
      if (operation === "textContainer") {
        const updatedContent =
          await this.manageContentService.editHomePageV2Content(
            { ...req.body, ...req.files },
            operation,
          );

        res.sendSuccess200Response("edited successfully", updatedContent);
      }
      if (operation === "emailSection") {
        const updatedContent =
          await this.manageContentService.editHomePageV2Content(
            { ...req.body, ...req.files },
            operation,
          );

        res.sendSuccess200Response("edited successfully", updatedContent);
      }
      if (operation === "companiesLogo") {
        const updatedContent =
          await this.manageContentService.editHomePageV2Content(
            { ...req.body },
            operation,
          );

        res.sendSuccess200Response("edited successfully", updatedContent);
      }
      if (operation === "headerLogoSideImage") {
        const updatedContent =
          await this.manageContentService.editHomePageV2Content(
            { ...req.body, ...req.files },
            operation,
          );

        res.sendSuccess200Response(
          "Header logo side image edited successfully",
          updatedContent,
        );
      }
      if (operation === "welcomeMessageForApp") {
        const updatedContent =
          await this.manageContentService.editHomePageV2Content(
            req.body,
            operation,
          );

        res.sendSuccess200Response("edited successfully", updatedContent);
      }

      res.sendErrorResponse("invalid operation value", null);
    } catch (error) {
      logger.error("editContent", error);
      res.sendErrorResponse("Error editing content", error);
    }
  };

  public getAllHomePageV2Content = async (_, res: Response) => {
    try {
      const content = await this.manageContentService.getAllHomePageV2Content();
      res.sendSuccess200Response(
        "Home page v2 Content retrieved successfully",
        content,
      );
    } catch (error) {
      logger.error("getAllContent", error);
      res.sendErrorResponse("Error retrieving content", error);
    }
  };

  // Side menu
  public sideMenuContent = async (req: Request, res: Response) => {
    try {
      const { alarm, tips } = req.body;
      const file: any = req.files?.logo;

      const data: any = {
        alarm,
        tips,
      };

      if (file) {
        data.logo = await this.uploadImage.uploadImage(file, "");
      }

      const sideMenuContent =
        await this.manageContentService.sideMenuContent(data);

      res.sendSuccess200Response(
        "Side menu content add successfully",
        sideMenuContent,
      );
    } catch (error) {
      logger.error("sideMenuContent", error);
      res.sendErrorResponse("Error in sideMenuContent", error);
    }
  };

  public getSideMenuContent = async (_: Request, res: Response) => {
    try {
      const content = await this.manageContentService.getSideMenuContent();
      res.sendSuccess200Response("Content retrieved successfully", content);
    } catch (error) {
      logger.error("getSideMenuContent", error);
      res.sendErrorResponse("Error retrieving content", error);
    }
  };

  // Job wall
  public jobWallContent = async (req: Request, res: Response) => {
    try {
      const { headingOne, headingTwo } = req.body;
      const file: any = req.files?.logo;

      const data: any = {
        headingOne,
        headingTwo,
      };

      if (file) {
        data.logo = await this.uploadImage.uploadImage(file, "");
      }

      const jobWallContent =
        await this.manageContentService.jobWallContent(data);

      res.sendSuccess200Response(
        "Side menu content add successfully",
        jobWallContent,
      );
    } catch (error) {
      logger.error("sideMenuContent", error);
      res.sendErrorResponse("Error in sideMenuContent", error);
    }
  };

  public getJobWallContent = async (_: Request, res: Response) => {
    try {
      const content = await this.manageContentService.getJobWallContent();
      res.sendSuccess200Response("Content retrieved successfully", content);
    } catch (error) {
      logger.error("getSideMenuContent", error);
      res.sendErrorResponse("Error retrieving content", error);
    }
  };
}

export default ManageContentController;
