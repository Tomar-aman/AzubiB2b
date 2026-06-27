import express from "express";
import CityController from "./city.controller";
import AdminAuthMiddleware from "../../middleware/adminAuthMiddleware";

const cityRoute = express.Router();
const cityController = new CityController();
const adminAuthMiddlewar = new AdminAuthMiddleware();

cityRoute.post("/city", adminAuthMiddlewar.verifyToken, cityController.addCity);

cityRoute.get(
  "/city/:id",
  adminAuthMiddlewar.verifyToken,
  cityController.getCityById,
);

cityRoute.put(
  "/city/:id",
  adminAuthMiddlewar.verifyToken,
  cityController.updateCityById,
);

cityRoute.patch(
  "/city/:id",
  adminAuthMiddlewar.verifyToken,
  cityController.updateStatus,
);

cityRoute.delete(
  "/city/:id",
  adminAuthMiddlewar.verifyToken,
  cityController.deleteCityById,
);

cityRoute.get(
  "/all-cities",
  adminAuthMiddlewar.verifyToken,
  cityController.getAllCities,
);

// For App
cityRoute.get("/cities", cityController.getAllCitiesForApp);

export default cityRoute;
