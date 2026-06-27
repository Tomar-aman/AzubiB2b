import mongoose, { model, Schema, type Document } from "mongoose";

export interface AppointmentContent {
    companyId: mongoose.Schema.Types.ObjectId;
    text: string;
};

export interface AppointmentContentDoc extends AppointmentContent, Document {
    createdAt: Date;
    updatedAt: Date;
};

const appointmentContentSchema = new Schema<AppointmentContentDoc>(
    {
        companyId: { type: mongoose.Schema.Types.ObjectId, required: true },
        text: { type: String },
    },
    { timestamps: true },
);

const _appointmentContentModel = model<AppointmentContentDoc>(
    "AppointmentContent",
    appointmentContentSchema,
);

export default _appointmentContentModel;