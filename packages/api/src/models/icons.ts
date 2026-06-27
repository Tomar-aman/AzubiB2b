import { model, Schema } from "mongoose";

export interface Icon {
  icon: string;
}

export interface IconDoc extends Icon, Document {
  createdAt: Date;
  updatedAt: Date;
}

const IconSchema = new Schema<IconDoc>(
  {
    icon: { type: String },
  },
  { timestamps: true },
);

const _iconModel = model<IconDoc>("icon", IconSchema);

export default _iconModel;
