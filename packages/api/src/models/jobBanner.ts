import { Schema, model, type Document } from "mongoose";
export interface JobBannerDocument extends Document {
  isDeleted: boolean;
  job?: Schema.Types.ObjectId;
  city?: Schema.Types.ObjectId;
  companyId: Schema.Types.ObjectId;
  bannerTitle: string;
  jobUrl?: string;
  images?: string;
  industry?: Schema.Types.ObjectId;
  jobType?: Schema.Types.ObjectId;
  addLine?: Array<{ text: string }>;
  embeddedCode?: string;
}

const addLineSchema = new Schema({
  text: {
    type: String,
    default: "",
  },
});

const jobBannerSchema = new Schema<JobBannerDocument>(
  {
    isDeleted: { type: Boolean, required: false, default: false },
    job: { type: Schema.Types.ObjectId, required: false, ref: "Jobs" },
    companyId: { type: Schema.Types.ObjectId, required: true, ref: "Company" },
    city: { type: Schema.Types.ObjectId, required: true, ref: "City" },
    industry: {
      type: Schema.Types.ObjectId,
      ref: "Industries",
      required: false,
    },
    jobType: { type: Schema.Types.ObjectId, required: false, ref: "JobTypes" },
    bannerTitle: { type: String, required: true },
    addLine: { type: [addLineSchema], default: [] },
    jobUrl: { type: String, default: "" },
    images: { type: String },
    embeddedCode: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const _jobBannerModel = model<JobBannerDocument>("JobBanner", jobBannerSchema);

export default _jobBannerModel;
