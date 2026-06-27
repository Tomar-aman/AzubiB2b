import express from "express";
import AppointmentFormController from "./appointment.controller";
import AdminAuthMiddleware from "../../middleware/adminAuthMiddleware";

const appointmentFormRoute = express.Router();
const appointmentFormController = new AppointmentFormController();
const adminAuthMiddleware = new AdminAuthMiddleware();

appointmentFormRoute.post("/appointment-form", appointmentFormController.add);

// Appointment Content 
appointmentFormRoute.put(
    "/appointment-content",
    adminAuthMiddleware.verifyToken,
    appointmentFormController.appointmentContent);

appointmentFormRoute.get(
    "/get-appointment-content",
    adminAuthMiddleware.verifyToken,
    appointmentFormController.getAppointmentContent,
);

// For app
appointmentFormRoute.get(
    "/appointment-content/:companyId",
    appointmentFormController.getAppointmentContentForApp,
);

export default appointmentFormRoute;
