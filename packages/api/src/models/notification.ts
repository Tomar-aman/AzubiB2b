import { model, Schema } from "mongoose";

export interface Notification {
  companyId: Schema.Types.ObjectId;
  title: string;
  description: string;
}

export interface NotificationDoc extends Notification, Document {
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<NotificationDoc>(
  {
    companyId: { type: Schema.Types.ObjectId, required: true, ref: "Company" },
    title: { type: String },
    description: { type: String },
  },
  { timestamps: true },
);

const _notificationModel = model<NotificationDoc>(
  "Notification",
  notificationSchema,
);

export default _notificationModel;
