import express from "express";
import AdminAuthMiddleware from "../../middleware/adminAuthMiddleware";
import JobAlarmController from "./jobAlarm.controller";

const route = express.Router();
const adminAuthMiddlewar = new AdminAuthMiddleware();
const controller = new JobAlarmController();
const routeName: string = "/job-alarm";

route.post(
  routeName,
  controller.add
);

route.get(
  routeName + "/:id",
  // adminAuthMiddlewar.verifyToken,
  controller.getById,
);

route.put(
  routeName + "/:id",
  adminAuthMiddlewar.verifyToken,
  controller.updateById,
);

route.get(routeName + "s", adminAuthMiddlewar.verifyToken, controller.getAll);

route.delete(
  routeName + "/:id",
  adminAuthMiddlewar.verifyToken,
  controller.deleteById,
);

const jobAlarmRoute = route;

export default jobAlarmRoute;
