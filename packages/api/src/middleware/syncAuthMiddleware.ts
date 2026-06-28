import { type Request, type Response, type NextFunction } from "express";

const syncAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const secret = req.headers["x-sync-secret"];
  if (!process.env.SYNC_SECRET || secret !== process.env.SYNC_SECRET) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  next();
};

export default syncAuthMiddleware;
