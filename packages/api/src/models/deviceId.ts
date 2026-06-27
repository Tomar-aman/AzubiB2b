import { model, Schema } from "mongoose";

export interface DeviceId {
  deviceId: string;
  notificationSentDate: Date;
}

export interface DeviceIdDoc extends DeviceId, Document {
  createdAt: Date;
  updatedAt: Date;
}

const deviceIdSchema = new Schema<DeviceIdDoc>({
  deviceId: { type: String },
  notificationSentDate: { type: Date, default: null },
});

const _deviceIdModel = model<DeviceIdDoc>("DeviceId", deviceIdSchema);
export default _deviceIdModel;
