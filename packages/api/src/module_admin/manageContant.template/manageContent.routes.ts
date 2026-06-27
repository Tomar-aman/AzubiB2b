import express from "express";
import ManageContentController from "./manageContent.controller";
import AdminAuthMiddleware from "../../middleware/adminAuthMiddleware";

const manageContentRoute = express.Router();
const manageContentController = new ManageContentController();
const adminAuthMiddleware = new AdminAuthMiddleware();

// apply form content
manageContentRoute.put(
  "/apply-form-content",
  manageContentController.editApplyFormContent,
);
manageContentRoute.get(
  "/apply-form-content",
  manageContentController.getAllApplyFormContent,
);

// faq content
manageContentRoute.put("/faq-content", manageContentController.editFaqContent);
manageContentRoute.get(
  "/faq-content",
  manageContentController.getAllFAQContent,
);

// about content
manageContentRoute.put(
  "/about-content",
  manageContentController.editAboutContent,
);
manageContentRoute.get(
  "/about-content",
  manageContentController.getAllAboutContent,
);

// Contact-us content
manageContentRoute.get(
  "/contact-us",
  manageContentController.getAllContactUsContent,
);
manageContentRoute.put(
  "/contact-us",
  manageContentController.editContactUsContent,
);

// Home page v2
manageContentRoute.get(
  "/home-page-v2",
  manageContentController.getAllHomePageV2Content,
);
manageContentRoute.put(
  "/home-page-v2",
  manageContentController.editHomePageV2Content,
);

// Side menu content
manageContentRoute.put(
  "/sidemenu",
  adminAuthMiddleware.verifyToken,
  manageContentController.sideMenuContent,
);

manageContentRoute.get(
  "/get-sidemenu-content",
  adminAuthMiddleware.verifyToken,
  manageContentController.getSideMenuContent,
);

// Job wall content
manageContentRoute.put(
  "/job-wall-content",
  adminAuthMiddleware.verifyToken,
  manageContentController.jobWallContent,
);

manageContentRoute.get(
  "/get-jobwall-content",
  adminAuthMiddleware.verifyToken,
  manageContentController.getJobWallContent,
);

export default manageContentRoute;
