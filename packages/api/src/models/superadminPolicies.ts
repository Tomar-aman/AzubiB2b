import { model, Schema, type Document } from "mongoose";

export interface Policy {
  // userId: mongoose.Schema.Types.ObjectId;
  description: string;
}

export interface PolicyDoc extends Policy, Document {
  createdAt: Date;
  updatedAt: Date;
}

const policySchema = new Schema<PolicyDoc>(
  {
    // userId: { type: mongoose.Schema.Types.ObjectId, required: true,ref: "User" },
    description: { type: String },
  },
  { timestamps: true },
);

const _policyModel = model<PolicyDoc>("Policy", policySchema);

export default _policyModel;
