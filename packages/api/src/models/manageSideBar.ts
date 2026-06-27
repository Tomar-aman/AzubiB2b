// Manage-sidebar page
import { model, Schema } from "mongoose";

export interface SideBarContent {
  logo: string;
}

export interface SideBarContentDoc extends SideBarContent, Document {
  createdAt: Date;
  updatedAt: Date;
}

const sideBarContentSchema = new Schema<SideBarContentDoc>(
  {
    logo: { type: String },
  },
  { timestamps: true },
);

const _sideBarContentModel = model<SideBarContentDoc>(
  "SideBarContent",
  sideBarContentSchema,
);

export default _sideBarContentModel;
