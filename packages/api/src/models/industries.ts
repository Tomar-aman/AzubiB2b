// import mongoose from "mongoose";
import { Schema, model, type Document } from "mongoose";
export interface Industries {
  // companyId: mongoose.Schema.Types.ObjectId;
  industryName: string;
  status: boolean;
  isDeleted: boolean;
}

export interface IndustriesDocument extends Industries, Document {
  createdAt: Date;
  updatedAt: Date;
}

const industriesSchema = new Schema<IndustriesDocument>(
  {
    // companyId: { type: mongoose.Schema.Types.ObjectId, required: true },
    industryName: { type: String, required: true },
    status: { type: Boolean, default: true },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const _industriesModel = model<IndustriesDocument>(
  "Industries",
  industriesSchema,
);

export default _industriesModel;
