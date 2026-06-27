import express from "express";
import AuthMiddleware from "../../middleware/authMiddleware";
import ImpressumController from "./manageImpressum.controller";

const impressumRoute = express.Router();
const impressumController = new ImpressumController();
const authMiddleware = new AuthMiddleware();

impressumRoute.put(
    "/impressum",
    authMiddleware.protect,
    impressumController.impressumContent,
);

impressumRoute.get(
    "/impressum",
    authMiddleware.protect,
    impressumController.getImpressum,
);

impressumRoute.get(
    "/get-impressum",
    impressumController.getImpressumForApp,
);

export default impressumRoute;