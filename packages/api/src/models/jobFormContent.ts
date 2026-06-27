import { Schema, model, type Document } from "mongoose";

export interface JobFormContent {
    // userId?: Schema.Types.ObjectId;
    coverLetter: string;
};

export interface JobFormContentDocument extends JobFormContent, Document {
    createdAt: Date;
    updatedAt: Date;
};

const JobFormContentSchema = new Schema<JobFormContentDocument>(
    {
        // userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        coverLetter: { type: String, required: true },
    },
    {
        timestamps: true,
    },
);

const _jobFormContentModel = model<JobFormContentDocument>("JobFormContent", JobFormContentSchema);

export default _jobFormContentModel;