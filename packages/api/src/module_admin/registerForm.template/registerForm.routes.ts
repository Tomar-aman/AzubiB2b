import express from "express";
import RegisterFormController from "./registerForm.controller";

const registerFormRoute = express.Router();
const registerFormController = new RegisterFormController();

registerFormRoute.post("/register-form", registerFormController.createForm);

registerFormRoute.get("/register-forms", registerFormController.getAllForApp);

export default registerFormRoute;
