import { Schema, model, type Document } from "mongoose";

export interface News {
    companyId: Schema.Types.ObjectId;
    title: string;
    description: string;
    images?: string[];  // max 3 images
    status: boolean;
    isDeleted: boolean;
}

export interface NewsDoc extends News, Document {
    createdAt: Date;
    updatedAt: Date;
}

const docsData = new Schema({
    file: {
        type: String,
        default: null,
    },
})

const newsSchema = new Schema<NewsDoc>(
    {
        companyId: { type: Schema.Types.ObjectId, required: true, ref: "Company" },
        title: { type: String },
        description: { type: String },
        images: { type: [docsData], default: [] },
        status: { type: Boolean, default: true },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

const _newsModel = model<NewsDoc>(
    "News",
    newsSchema,
);

export default _newsModel;
