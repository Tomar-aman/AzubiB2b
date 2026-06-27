// Manage Tips page
import mongoose, { model, Schema, type Document } from "mongoose";

export interface PolicyContent {
  companyId: mongoose.Schema.Types.ObjectId;
  description: string;
}

export interface PolicyContentDoc extends PolicyContent, Document {
  createdAt: Date;
  updatedAt: Date;
}

const policyContentSchema = new Schema<PolicyContentDoc>(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, required: true },
    description: { type: String },
  },
  { timestamps: true },
);

const _policyContentModel = model<PolicyContentDoc>(
  "PolicyContent",
  policyContentSchema,
);

export default _policyContentModel;
