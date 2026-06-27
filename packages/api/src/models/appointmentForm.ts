import mongoose, { Schema, model, type Document } from "mongoose";

export interface AppointmentForm {
    companyId: mongoose.Schema.Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    aboutMe: string;
    appointment: string;
    isDeleted?: boolean;
};

export interface AppointmentDocument extends AppointmentForm, Document {
    createdAt: Date;
    updatedAt: Date;
}

const appointmentFormSchema = new Schema<AppointmentDocument>(
    {
        // createdBy: { type: Schema.Types.ObjectId, required: true, ref: "Company" },
        companyId: { type: mongoose.Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        aboutMe: { type: String },
        appointment: { type: String, required: true },
        isDeleted: { type: Boolean, required: true, default: false },
    },
    {
        timestamps: true,
    },
);

const _appointmentFormModel = model<AppointmentDocument>(
    "AppointmentForm",
    appointmentFormSchema
);

export default _appointmentFormModel;