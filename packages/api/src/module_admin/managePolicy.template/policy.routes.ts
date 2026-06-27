
import express from "express";
import AdminAuthMiddleware from "../../middleware/adminAuthMiddleware";
import PrivacyPolicyContentController from "./policy.controller";

const privacyPolicyRoute = express.Router();
const privacyPolicyController = new PrivacyPolicyContentController();
const adminAuthMiddleware = new AdminAuthMiddleware();

privacyPolicyRoute.put(
    "/add-privacy-policy",
    adminAuthMiddleware.verifyToken,
    privacyPolicyController.privacyPolicyContent,
);

privacyPolicyRoute.get(
    "/get-privacy-policy",
    adminAuthMiddleware.verifyToken,
    privacyPolicyController.getPrivacyPolicyContent,
);

// For app
privacyPolicyRoute.get(
    "/privacy-policy/:companyId",
    privacyPolicyController.getPrivacyPolicyContentForApp,
);

export default privacyPolicyRoute;