import express from "express";
import ContactFormController from "./manageForm.controller";

const contactFormRoute = express.Router();
const contactFormController = new ContactFormController();

contactFormRoute.post("/contact-form", contactFormController.createForm);

export default contactFormRoute;
