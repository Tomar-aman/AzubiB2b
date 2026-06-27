import { type Request, type Response } from "express";
import logger from "../../utils/logger";
import { NewsService } from "./news.service";
import { UploadImage } from "../../utils/uploadImage";
import ObjectIdConverter from "../../utils/objectIdConvertor";
import { NewsModel } from "../../models";

class NewsController {
    private readonly newsService: NewsService;
    private readonly uploadImage: UploadImage;
    private readonly objectIdConverter: ObjectIdConverter;

    constructor() {
        this.newsService = new NewsService();
        this.uploadImage = new UploadImage();
        this.objectIdConverter = new ObjectIdConverter();
    }

    public newsContent = async (req: Request, res: Response) => {
        try {
            const companyId = (req as any).admin.id;
            const { title, description } = req.body;
            const files: any = req.files;

            if (!title || !description) {
                return res.status(400).json({
                    success: false,
                    message: "Title and description are required"
                });
            }

            let uploadedImages: string[] = [];

            if (files) {
                const imageFiles: any[] = [];

                if (files.images) {
                    imageFiles.push(...(Array.isArray(files.images) ? files.images : [files.images]));
                }

                Object.keys(files).forEach(key => {
                    if (key.startsWith('images[') && key.endsWith(']')) {
                        const file = files[key];
                        imageFiles.push(...(Array.isArray(file) ? file : [file]));
                    }
                });

                if (imageFiles.length > 3) {
                    return res.status(400).json({
                        success: false,
                        message: "Maximum 3 images allowed"
                    });
                }

                for (const file of imageFiles) {
                    try {
                        const imagePath: any = await this.uploadImage.uploadImage(
                            file,
                            "/public/news",
                            false
                        );
                        uploadedImages.push(imagePath);
                    } catch (uploadError) {
                        logger.error("Error uploading image:", uploadError);
                    }
                }
            }

            const data: any = {
                companyId: this.objectIdConverter.convertToObjectId(companyId),
                title,
                description,
                images: uploadedImages
            };

            const news = await this.newsService.newsContent(data);

            res.sendSuccess200Response(
                "News content added successfully",
                news,
            );
        } catch (error) {
            logger.error("newsContent", error);
            res.sendErrorResponse("Error in newsContent", error);
        }
    };

    public getNewsContent = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const content = await this.newsService.getNewsContent(id);

            if (!content) {
                res.sendNotFound404Response("News not found", null);
                return;
            }

            res.sendSuccess200Response("News retrieved successfully", content);
        } catch (error) {
            logger.error("getNewsContent", error);
            res.sendErrorResponse("Error retrieving news", error);
        }
    };

    public getAllNews = async (req: Request, res: Response) => {
        try {
            const id = (req as any).admin.id;
            const { searchValue, pageNo, recordPerPage } = req.query;

            const news = await this.newsService.getAllNews(
                id,
                searchValue as string,
                pageNo as unknown as number,
                recordPerPage as unknown as number,
            );

            res.sendSuccess200Response(
                "News retrieved successfully",
                news,
            );
        } catch (error) {
            logger.error("getAllNews", error);
            res.sendErrorResponse("Error retrieving news", error);
        }
    };

    public deleteNewsById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const deletedNews =
                await this.newsService.deleteNewsById(id);

            res.sendSuccess200Response(
                "News marked as deleted successfully",
                deletedNews,
            );
        } catch (error) {
            logger.error("deleteNewsById", error);
            res.sendErrorResponse("Error deleting news", error);
        }
    };

    public updateNewsById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const {
                existingImages,
                ...otherProfileFields
            } = req.body;

            let images: any[] = [];

            if (existingImages) {
                try {
                    const parsed = JSON.parse(existingImages);
                    if (Array.isArray(parsed)) {
                        images = parsed;
                    }
                } catch (e) {
                    console.log("Could not parse existingImages");
                }
            }

            if (req.body.images && Array.isArray(req.body.images)) {
                for (const img of req.body.images) {
                    if (
                        !img._id &&
                        typeof img.file === "string" &&
                        img.file.startsWith("data:")
                    ) {
                        const base64Data = img.file;
                        const uploaded = await this.uploadImage.uploadImage(
                            base64Data,
                            "/public/news",
                        );
                        images.push({
                            _id: null,
                            file: uploaded,
                        });
                    }
                }
            }
            const uploadedFiles = Array.isArray(req.files?.["images[]"])
                ? req.files?.["images[]"]
                : req.files?.["images[]"]
                    ? [req.files?.["images[]"]]
                    : [];

            for (const file of uploadedFiles) {
                const uploadedFile = await this.uploadImage.uploadImage(
                    file,
                    "/public/news",
                );
                images.push({ file: uploadedFile });
            }

            if (images.length > 3) {
                return res.status(400).json({
                    success: false,
                    message: "Maximum 3 images allowed"
                });
            }

            otherProfileFields.images = images;

            const company = await this.newsService.updateNewsById(
                id,
                otherProfileFields,
            );

            res.sendSuccess200Response("News updated successfully", company);
        } catch (error) {
            console.log(error)
            logger.error("updateNewsById", error);
            res.sendErrorResponse("Error updating news", error);
        }
    };

    public deleteNewsImagesById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { fileUrl } = req.query;

            if (!fileUrl) {
                throw new Error("fileUrl is required");
            }

            const news = await NewsModel.findById(id);
            if (!news) {
                throw new Error("News not found");
            }

            if (!Array.isArray(news.images)) {
                news.images = [];
            }

            // Check file exists
            const exists = news.images.some(
                (item: any) => item.file.toString() === fileUrl.toString(),
            );

            if (!exists) {
                throw new Error("File not found in images");
            }

            news.images = news.images.filter(
                (item: any) => item.file.toString() !== fileUrl.toString(),
            );

            await news.save();

            res.sendSuccess200Response("News image deleted successfully", { news });
        } catch (error) {
            logger.error("deleteNewsImagesById", error);
            res.sendErrorResponse("Error deleting news image", error);
        }
    };

    //For app
    public getAllNewsForApp = async (req: Request, res: Response) => {
        try {
            const { searchValue, pageNo, recordPerPage } = req.query;
            const { companyId } = req.params;

            const news = await this.newsService.getAllNewsForApp(
                searchValue as string,
                pageNo as unknown as number,
                recordPerPage as unknown as number,
                companyId as string,
            );

            res.sendSuccess200Response(
                "News retrieved successfully",
                news,
            );
        } catch (error) {
            logger.error("getAllNews", error);
            res.sendErrorResponse("Error retrieving news", error);
        }
    };

    public getNewsForApp = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const job = await this.newsService.getNewsByIdForApp(id);
            if (!job) {
                res.sendNotFound404Response("News not found", null);
                return;
            }

            res.sendSuccess200Response("News retrieved successfully", job);
        } catch (error) {
            logger.error("getNewsById", error);
            res.sendErrorResponse("Error retriveing news", error);
        }
    };
}

export default NewsController;