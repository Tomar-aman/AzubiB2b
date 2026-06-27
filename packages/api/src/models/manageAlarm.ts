// Manage alarm page
import { model, Schema } from "mongoose";

export interface AlarmContent {
  logo: string;
  lineOne: string;
  lineTwo: string;
}

export interface AlarmContentDoc extends AlarmContent, Document {
  createdAt: Date;
  updatedAt: Date;
}

const alarmContentSchema = new Schema<AlarmContentDoc>(
  {
    logo: { type: String },
    lineOne: { type: String },
    lineTwo: { type: String },
  },
  { timestamps: true },
);

const _alarmContentModel = model<AlarmContentDoc>(
  "AlarmContent",
  alarmContentSchema,
);

export default _alarmContentModel;
