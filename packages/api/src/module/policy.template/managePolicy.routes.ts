import express from "express";
import PolicyController from "./managePolicy.controller";
import AuthMiddleware from "../../middleware/authMiddleware";

const policyRoute = express.Router();
const policyController = new PolicyController();
const authMiddleware = new AuthMiddleware();

policyRoute.put(
    "/privacy-policy",
    authMiddleware.protect,
    policyController.policyContent,
);

policyRoute.get(
    "/policy",
    authMiddleware.protect,
    policyController.getPolicy,
);

policyRoute.get(
    "/privacy-policy",
    policyController.getPolicyForApp,
);

export default policyRoute;