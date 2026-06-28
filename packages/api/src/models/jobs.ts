import { Schema, model, type Document } from "mongoose";

export interface Attachment {
  path: string;
  filetype: string;
  createdAt?: Date;
}
export interface Job {
  userId?: Schema.Types.ObjectId;
  companyId: Schema.Types.ObjectId;
  jobType: Schema.Types.ObjectId;
  city: Schema.Types.ObjectId[];
  industryName: Schema.Types.ObjectId;
  jobTitle: string;
  phoneNumber: string;
  email: string;
  additionalEmail?: string;
  address: string;
  mapUrl?: string;
  locationField: string;
  locationUrl: any;
  jobDescription: string;
  attachement?: Attachment[];
  videoLink: string;
  jobImages?: string[];
  additionalData?: Array<{ text: string; file: string }>;
  embeddedCode: string;
  startDate: Date;
  status: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  isDesktopView?: boolean;
  source?: string;
  fachzubiId?: string;
  fachzubiMeta?: Record<string, unknown>;
}

export interface JobDocument extends Job, Document {
  createdAt: Date;
  updatedAt: Date;
  deleteJob: () => Promise<void>;
  restoreJob: () => Promise<void>;
}

const additionalDataSchema = new Schema({
  id: { type: String },
  file: {
    type: String,
    default: null,
  },
  text: { type: String, default: "" },
});

const docsData = new Schema({
  file: {
    type: String,
    default: null,
  },
})

const jobSchema = new Schema(
  {
    jobType: { type: Schema.Types.ObjectId, ref: "JobTypes", required: false },
    city: [{ type: Schema.Types.ObjectId, ref: "City", required: true }],
    industryName: {
      type: Schema.Types.ObjectId,
      ref: "Industries",
      required: true,
    },
    jobTitle: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    additionalEmail: { type: String },
    address: { type: String, required: true },
    mapUrl: { type: String, required: false },
    locationField: { type: String, required: true },
    locationUrl: { type: String, required: false },
    jobDescription: { type: String, required: true },
    // attachement: [{ type: String, required: false }],
    attachement: { type: [docsData], default: [] },
    videoLink: { type: String, required: false },
    // jobImages: [{ type: String }],
    jobImages: { type: [docsData], default: [] },
    embeddedCode: { type: String, default: "" },
    additionalData: { type: [additionalDataSchema], default: [] },
    startDate: { type: Date, required: false },
    status: { type: Boolean, default: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    companyId: { type: Schema.Types.ObjectId, required: true, ref: "Company" },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    isDesktopView: { type: Boolean, default: false },
    source: { type: String, enum: ["azubi", "fachzubi"], default: "azubi" },
    fachzubiId: { type: String, default: null },
    // Snapshot of Fachzubi-specific job detail (zipCode, video links, city /
    // industry / region names, etc.) shown on the Fachzubi job detail page.
    fachzubiMeta: { type: Schema.Types.Mixed, default: null },
  },
  {
    timestamps: true,
  },
);

// Soft delete method
jobSchema.methods.deleteJob = async function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  await this.save();
};

// Restore method (undo soft delete)
jobSchema.methods.restoreJob = async function () {
  this.isDeleted = false;
  this.deletedAt = null;
  await this.save();
};

jobSchema.pre("find", function () {
  void this.where({ isDeleted: false });
});

jobSchema.pre("findOne", function () {
  void this.where({ isDeleted: false });
});

const _jobsModel = model<JobDocument>("Job", jobSchema);

export default _jobsModel;
