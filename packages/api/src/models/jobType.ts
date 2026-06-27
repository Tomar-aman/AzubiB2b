import { Schema, model, type Document } from "mongoose";

export interface JobTypes {
  // companyId: mongoose.Schema.Types.ObjectId;
  jobTypeName: string;
  isDeleted: boolean;
}

export interface JobTypesDocument extends JobTypes, Document {
  createdAt: Date;
  updatedAt: Date;
}

const jobTypesSchema = new Schema<JobTypesDocument>(
  {
    // companyId: { type: mongoose.Schema.Types.ObjectId, required: true },
    jobTypeName: { type: String, required: true },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

jobTypesSchema.index(
  { companyId: 1, jobTypeName: 1 },
  { unique: true }
);

const _jobTypesModel = model<JobTypesDocument>("JobTypes", jobTypesSchema);

export default _jobTypesModel;
