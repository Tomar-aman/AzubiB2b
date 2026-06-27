import { type Request, type Response, type NextFunction } from "express";
import logger from "../utils/logger";
import jwt from "jsonwebtoken";
import { CompanyModel } from "../models";

class AdminAuthMiddleware {
  public verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const token = req.headers.authorization?.split("Bearer ")[1];
    try {
      if (token) {
        if (!process.env.JWT_SECRET) {
          throw new Error("SECRET KEY is requred");
        }
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await CompanyModel.findById((decodedData as any).id);
        (req as any).admin = admin;
        next();
      } else {
        res.status(401).json({
          message: "Not Authorized",
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log({ error });
      logger.error("Authentication Error:", error);
      res.sendErrorResponse("Invalid or expired token", error);
    }
  };
}

export default AdminAuthMiddleware;
