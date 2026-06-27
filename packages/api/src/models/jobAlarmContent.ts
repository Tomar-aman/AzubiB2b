import { Schema, model, type Document } from "mongoose";

export interface JobAlarmContent {
    // userId?: Schema.Types.ObjectId;
    image: string;
    heading: string;
    text: string;
};

export interface JobAlarmContentDocument extends JobAlarmContent, Document {
    createdAt: Date;
    updatedAt: Date;
};

const JobAlarmContentSchema = new Schema<JobAlarmContentDocument>(
    {
        // userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        image: { type: String },
        heading: { type: String, required: true },
        text: { type: String, required: true },
    },
    {
        timestamps: true,
    },
);

const _jobAlarmContentModel = model<JobAlarmContentDocument>("JobAlarmContent", JobAlarmContentSchema);

export default _jobAlarmContentModel;