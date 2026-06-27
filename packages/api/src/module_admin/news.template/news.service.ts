import ObjectIdConverter from "../../utils/objectIdConvertor";
import { NewsModel } from "../../models";
import { News, NewsDoc } from "../../models/news";
import mongoose from "mongoose";

export class NewsService {
    private readonly objectIdConverter: ObjectIdConverter;
    constructor() {
        this.objectIdConverter = new ObjectIdConverter();
    }
    public async newsContent(data: News): Promise<NewsDoc> {
        const formattedImages = data.images?.map(imageUrl => ({
            file: imageUrl
        })) || [];

        const news = await NewsModel.create(
            {
                companyId: data.companyId,
                title: data.title,
                description: data.description,
                images: formattedImages
            },
        );

        return news;
    };

    public async getNewsContent(id: string) {
        const pipeline: any[] = [
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id),
                    isDeleted: false,
                },
            },
            {
                $lookup: {
                    from: NewsModel.collection.name,
                    localField: "companyId",
                    foreignField: "_id",
                    as: "company",
                },
            },
            {
                $project: {
                    company: { $arrayElemAt: ["$company._id", 0] },
                    title: 1,
                    description: 1,
                    images: 1
                }
            }
        ]
        const result = await NewsModel.aggregate(pipeline).exec();
        return result.length > 0 ? result[0] : null;
    };

    public async getAllNews(
        id: string,
        searchValue?: string,
        pageNo: number = 1,
        recordPerPage: number = 10,
    ) {
        const objectId = this.objectIdConverter.convertToObjectId(id);
        const limit = Math.max(1, recordPerPage);
        const skip = (pageNo - 1) * limit;
        const pipeline: any[] = [
            { $match: { isDeleted: false, companyId: objectId } },
        ];

        if (searchValue) {
            pipeline.push({
                $match: {
                    title: { $regex: new RegExp(searchValue, "i") },
                },
            });
        }

        pipeline.push({
            $lookup: {
                from: "companies",
                localField: "companyId",
                foreignField: "_id",
                as: "companyId",
            },
        });

        pipeline.push({
            $unwind: {
                path: "$companyId",
                preserveNullAndEmptyArrays: true,
            },
        });

        pipeline.push({
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                images: 1,
                "companyId._id": 1,
                "companyId.companyname": 1,
            },
        });

        pipeline.push({ $skip: skip }, { $limit: limit });

        const countPipeline = [...pipeline];
        countPipeline.splice(-2); // Remove $skip and $limit for count
        // countPipeline.push({ $count: "totalCities" });

        const [news, totalResult] = await Promise.all([
            NewsModel.aggregate(pipeline),
            NewsModel.aggregate(countPipeline),
        ]);

        const totalNews = totalResult.length

        return { totalNews, news };
    };

    public async deleteNewsById(id: string) {
        const deletedNews = await NewsModel.findByIdAndDelete(id);
        return deletedNews;
    };

    public async updateNewsById(
        id: string,
        newsFields?: Record<string, any>,
    ) {
        const news = await NewsModel.findById(id);
        if (!news) {
            throw new Error("News not found");
        }

        if (newsFields) {
            Object.assign(news, newsFields);
        }

        await news.save();
        return news;
    }

    // For App
    public async getAllNewsForApp(
        searchValue?: string,
        pageNo: number = 1,
        recordPerPage: number = 10,
        companyId?: string,
    ) {
        const limit = Math.max(1, recordPerPage);
        const skip = (pageNo - 1) * limit;
        const pipeline: any[] = [
            { $match: { isDeleted: false } },
        ];

        if (searchValue) {
            pipeline.push({
                $match: {
                    title: { $regex: new RegExp(searchValue, "i") },
                },
            });
        }

        if (companyId) {
            pipeline.push({
                $match: {
                    companyId: new mongoose.Types.ObjectId(companyId),
                },
            });
        }

        pipeline.push({
            $lookup: {
                from: "companies",
                localField: "companyId",
                foreignField: "_id",
                as: "companyId",
            },
        });

        pipeline.push({
            $unwind: {
                path: "$companyId",
                preserveNullAndEmptyArrays: true,
            },
        });

        pipeline.push({
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                images: 1,
                "companyId._id": 1,
                "companyId.companyname": 1,
            },
        });

        pipeline.push({ $skip: skip }, { $limit: limit });

        const countPipeline = [...pipeline];
        countPipeline.splice(-2); // Remove $skip and $limit for count
        // countPipeline.push({ $count: "totalCities" });

        const [news, totalResult] = await Promise.all([
            NewsModel.aggregate(pipeline),
            NewsModel.aggregate(countPipeline),
        ]);

        const totalNews = totalResult.length

        return { totalNews, news };
    };

    public async getNewsByIdForApp(id: string) {
        const result = await NewsModel.findById(id);
        return result;
    };

};