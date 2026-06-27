import mongoose, { Schema, model, type Document } from "mongoose";

export interface ContactForm {
  companyId: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  isDeleted?: boolean;
}

export interface ContactFormDocument extends ContactForm, Document {
  createdAt: Date;
  updatedAt: Date;
}

const formSchema = new Schema<ContactFormDocument>(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: [true, "Please Enter Your Name"] },
    email: { type: String, required: [true, "Please Enter Your Email"] },
    phoneNumber: { type: String },
    message: { type: String },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  },
);

const _contactFormModel = model<ContactFormDocument>("ContactForm", formSchema);

export default _contactFormModel;
