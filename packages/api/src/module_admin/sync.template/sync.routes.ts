import express from "express";
import SyncController from "./sync.controller";
import syncAuthMiddleware from "../../middleware/syncAuthMiddleware";

const syncRoute = express.Router();
const syncController = new SyncController();

// Called by Fachzubi backend only — protected by shared secret
syncRoute.post("/company", syncAuthMiddleware, syncController.upsertCompany);
syncRoute.post("/job", syncAuthMiddleware, syncController.upsertJob);
syncRoute.delete("/company/:fachzubiId", syncAuthMiddleware, syncController.deleteCompany);
syncRoute.delete("/job/:fachzubiId", syncAuthMiddleware, syncController.deleteJob);

export default syncRoute;
