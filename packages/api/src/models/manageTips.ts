// Manage Tips page
import { model, Schema } from "mongoose";

export interface TipsContent {
  name: string;
  description: string;
}

export interface TipsContentDoc extends TipsContent, Document {
  createdAt: Date;
  updatedAt: Date;
}

const tipsContentSchema = new Schema<TipsContentDoc>(
  {
    name: { type: String },
    description: { type: String },
  },
  { timestamps: true },
);

const _tipsContentModel = model<TipsContentDoc>(
  "TipsContent",
  tipsContentSchema,
);

export default _tipsContentModel;
