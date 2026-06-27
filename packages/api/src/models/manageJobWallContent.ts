import { model, Schema } from "mongoose";

export interface JobWallContent {
  logo: string;
  headingOne: string;
  headingTwo: string;
}

export interface JobWallContentDoc extends JobWallContent, Document {
  createdAt: Date;
  updatedAt: Date;
}

const jobWallContentSchema = new Schema<JobWallContentDoc>(
  {
    logo: { type: String },
    headingOne: { type: String },
    headingTwo: { type: String },
  },
  { timestamps: true },
);

const _jobWallContentModel = model<JobWallContentDoc>(
  "JobWallContent",
  jobWallContentSchema,
);

export default _jobWallContentModel;
