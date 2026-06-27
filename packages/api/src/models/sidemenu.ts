// "/side-menu-content/add-menu-content" page
import { Schema, model, type Document } from "mongoose";

export interface SideMenu {
  createdBy: Schema.Types.ObjectId;
  name: string;
  url: string;
  color: string;
  icon: string;
  isDeleted?: boolean;
  jobAlarm?: boolean;
  tips?: boolean;
  regionWahlen?: boolean;
}

export interface SideMenuDocument extends SideMenu, Document {
  createdAt: Date;
  updatedAt: Date;
}

const sideMenuSchema = new Schema<SideMenuDocument>(
  {
    createdBy: { type: Schema.Types.ObjectId, required: true, ref: "Company" },
    name: { type: String, required: true },
    url: { type: String, required: true },
    color: { type: String, required: true },
    icon: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
    jobAlarm: { type: Boolean, default: true },
    tips: { type: Boolean, default: true },
    regionWahlen: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

const _sideMenuModel = model<SideMenuDocument>("Sidemenu", sideMenuSchema);

export default _sideMenuModel;
