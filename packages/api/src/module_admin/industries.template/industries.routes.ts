import express from "express";
import IndustriesController from "./industries.controller";
import AdminAuthMiddleware from "../../middleware/adminAuthMiddleware";

const industriesRoute = express.Router();
const industriesController = new IndustriesController();
const adminAuthMiddlewar = new AdminAuthMiddleware();

industriesRoute.post(
  "/industry",
  // adminAuthMiddlewar.verifyToken,
  industriesController.addIndustry,
);

industriesRoute.get(
  "/industry/:id",
  adminAuthMiddlewar.verifyToken,
  industriesController.getIndustryById,
);
industriesRoute.put(
  "/industry/:id",
  adminAuthMiddlewar.verifyToken,
  industriesController.updateIndustryById,
);

industriesRoute.get(
  "/all-industries",
  // adminAuthMiddlewar.verifyToken,
  industriesController.getAllIndustries,
);

industriesRoute.delete(
  "/industry/:id",
  adminAuthMiddlewar.verifyToken,
  industriesController.deleteIndustryById,
);

// For app--
industriesRoute.get("/industries", industriesController.getAllIndustriesForApp);

export default industriesRoute;
