import express from "express";
import AdminAuthMiddleware from "../../middleware/adminAuthMiddleware";
import NewsController from "./news.controller";


const newsRoute = express.Router();
const newsController = new NewsController();
const adminAuthMiddleware = new AdminAuthMiddleware();

newsRoute.put(
    "/add-news",
    adminAuthMiddleware.verifyToken,
    newsController.newsContent,
);

newsRoute.get(
    "/get-news-detail/:id",
    adminAuthMiddleware.verifyToken,
    newsController.getNewsContent,
);

newsRoute.get(
    "/all-news",
    adminAuthMiddleware.verifyToken,
    newsController.getAllNews,
)

newsRoute.delete(
    "/news/:id",
    adminAuthMiddleware.verifyToken,
    newsController.deleteNewsById,
);

newsRoute.put(
    "/news/:id",
    adminAuthMiddleware.verifyToken,
    newsController.updateNewsById,
);

newsRoute.delete(
    "/delete-news-images/:id",
    adminAuthMiddleware.verifyToken,
    newsController.deleteNewsImagesById,
);

// For app --
newsRoute.get(
    "/get-news/:id",
    newsController.getNewsForApp,
);

newsRoute.get(
    "/all-news/:companyId",
    newsController.getAllNewsForApp,
)

export default newsRoute;