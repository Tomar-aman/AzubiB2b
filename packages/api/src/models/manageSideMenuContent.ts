import { model, Schema } from "mongoose";

export interface SideMenuContent {
  logo: string;
  alarm: string;
  tips: string;
}

export interface SideMenuContentDoc extends SideMenuContent, Document {
  createdAt: Date;
  updatedAt: Date;
}

const sideMenuContentSchema = new Schema<SideMenuContentDoc>(
  {
    logo: { type: String },
    alarm: { type: String },
    tips: { type: String },
  },
  { timestamps: true },
);

const _sideMenuContentModel = model<SideMenuContentDoc>(
  "SideMenuContent",
  sideMenuContentSchema,
);

export default _sideMenuContentModel;
