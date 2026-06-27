import mongoose, { Schema, model, type Document } from "mongoose";

export interface Images {
  path: string; // Path to the file
  filetype: string; // Type of the file, e.g., "image"
  createdAt?: Date; // File creation date
}
export interface RegisterForm {
  companyId: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  dateOfBirth: string;
  images: Images[];
  isDeleted?: boolean;
}

export interface RegisterFormDocument extends RegisterForm, Document {
  createdAt: Date;
  updatedAt: Date;
}

const registerFormSchema = new Schema<RegisterFormDocument>(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: [true, "Please Enter Your Name"] },
    email: { type: String, required: [true, "Please Enter Your Email"] },
    phoneNumber: { type: String },
    message: { type: String },
    dateOfBirth: { type: String },
    images: {
      type: [
        {
          path: { type: String }, // File path or URL
          filetype: { type: String }, // File type, e.g., "image", "pdf", etc.
          createdAt: { type: Date, default: Date.now }, // File creation date
        },
      ],
    },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  },
);

const _registerFormModel = model<RegisterFormDocument>(
  "RegisterForm",
  registerFormSchema,
);

export default _registerFormModel;
