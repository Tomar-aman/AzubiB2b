import { Schema, model, type Document } from "mongoose";

export interface JobAlarm {
  companyId?: Schema.Types.ObjectId;
  jobTypeId?: Schema.Types.ObjectId;
  cityId?: Schema.Types.ObjectId;
  name: string;
  email: string;
  isDeleted?: boolean;
}

export interface JobAlarmDocument extends JobAlarm, Document {
  createdAt: Date;
  updatedAt: Date;
}

const JobAlarmSchema = new Schema<JobAlarmDocument>(
  {
    companyId: { type: Schema.Types.ObjectId, required: true, ref: "Company" },
    jobTypeId: { type: Schema.Types.ObjectId, required: true, ref: "JobTypes" },
    cityId: [{ type: Schema.Types.ObjectId, required: true, ref: "City" }],
    name: { type: String, required: true },
    email: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  },
);

const _jobAlarmModel = model<JobAlarmDocument>("JobAlarm", JobAlarmSchema);

export default _jobAlarmModel;
