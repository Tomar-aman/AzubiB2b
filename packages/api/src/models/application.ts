import mongoose, { Schema, model, type Document } from "mongoose";

export interface Attachment {
  path: string; // Path to the file
  filetype: string; // Type of the file, e.g., "image", "pdf"
  createdAt?: Date; // File creation date
}

export interface Application {
  // createdBy: Schema.Types.ObjectId;
  companyId: mongoose.Schema.Types.ObjectId;
  jobId: Schema.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  aboutMe: string;
  coverLetter: string;
  attachement?: Attachment[];
  isDeleted?: boolean;
}

export interface ApplicationDocument extends Application, Document {
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<ApplicationDocument>(
  {
    // createdBy: { type: Schema.Types.ObjectId, required: true, ref: "Company" },
    companyId: { type: mongoose.Schema.Types.ObjectId, required: true },
    jobId: { type: Schema.Types.ObjectId, required: true, ref: "Job" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    aboutMe: { type: String },
    coverLetter: { type: String },
    attachement: {
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

const _applicationModel = model<ApplicationDocument>(
  "Application",
  applicationSchema,
);

export default _applicationModel;
