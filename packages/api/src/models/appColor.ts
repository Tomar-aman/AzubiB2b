import { Schema, model, type Document } from "mongoose";

export interface AppColor {
  headingOneColor?: string;
  headingTwoColor?: string;
  manageEmail?: string;
  manageSavedJob?: string;
}

export interface AppColorDoc extends AppColor, Document {
  createdAt: Date;
  updatedAt: Date;
}

const appColorSchema = new Schema<AppColorDoc>(
  {
    headingOneColor: { type: String, default: "" },
    headingTwoColor: { type: String, default: "" },
    manageEmail: { type: String, default: "" },
    manageSavedJob: { type: String, default: "" },
  },
  {
    timestamps: true,
  },
);

const _appColorModel = model<AppColorDoc>("Appcolor", appColorSchema);
export default _appColorModel;
