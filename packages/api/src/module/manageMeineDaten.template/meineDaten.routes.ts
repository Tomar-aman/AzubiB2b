import express from "express";
import AuthMiddleware from "../../middleware/authMiddleware";
import MeineDatenController from "./meineDaten.controller";

const meineDatenRoute = express.Router();
const authMiddleware = new AuthMiddleware();
const meineDatenController = new MeineDatenController();

meineDatenRoute.put(
  "/meine-daten-content",
  authMiddleware.protect,
  meineDatenController.meineDatenContent,
);

meineDatenRoute.get(
  "/get-meine-daten",
  authMiddleware.protect,
  meineDatenController.getContent,
);

meineDatenRoute.get("/meine-daten-content", meineDatenController.getContentForApp);

export default meineDatenRoute;
