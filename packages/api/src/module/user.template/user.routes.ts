import express from "express";
import UserController from "./user.controller";
import AuthMiddleware from "../../middleware/authMiddleware";

const userRoute = express.Router();
const userController = new UserController();
const authMiddleware = new AuthMiddleware();

userRoute.get("/users", authMiddleware.protect, userController.getAllUsers);

userRoute.put("/user/:id", authMiddleware.protect, userController.updateUser);

userRoute.get("/user/:id", authMiddleware.protect, userController.getUserDetailById);

userRoute.get("/detail", authMiddleware.protect, userController.getDetail);

userRoute.put("/update", authMiddleware.protect, userController.updateSuperAdmin);

userRoute.delete("/delete/:id", authMiddleware.protect, userController.deleteUser)

export default userRoute;
