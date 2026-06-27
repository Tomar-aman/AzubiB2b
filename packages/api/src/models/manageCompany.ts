import mongoose from "mongoose";
import { Schema, model, type Document } from "mongoose";

export interface ManageCompany {
  companyId: mongoose.Schema.Types.ObjectId;
  jobListingPage?: string[];
  jobWall?: string[];
  sideMenu?: string[];
  manageAppColor?: boolean;
  manageJobAlarm?: boolean;
  manageIndustries?: boolean;
  manageCities?: boolean;
  manageBanners?: boolean;
  manageStatus?: boolean;
  manageEmailServices?: boolean;
}

export interface ManageCompanyDocument extends ManageCompany, Document {
  createdAt: Date;
  updatedAt: Date;
}

const ManageCompanySchema = new Schema<ManageCompanyDocument>(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    jobListingPage: {
      type: [String],
      default: [],
    },
    jobWall: {
      type: [String],
      default: [],
    },
    sideMenu: {
      type: [String],
      default: [],
    },
    manageAppColor: { type: Boolean, default: false },
    manageJobAlarm: { type: Boolean, default: false },
    manageIndustries: { type: Boolean, default: false },
    manageCities: { type: Boolean, default: false },
    manageBanners: { type: Boolean, default: false },
    manageStatus: { type: Boolean, default: true },
    manageEmailServices: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const _manageCompanyModel = model<ManageCompanyDocument>(
  "ManageCompany",
  ManageCompanySchema,
);
export default _manageCompanyModel;
