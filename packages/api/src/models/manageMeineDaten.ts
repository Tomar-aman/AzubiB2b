import { model, Schema, type Document } from "mongoose";

export interface MeineDaten {
  // userId: mongoose.Schema.Types.ObjectId;
  text: string;
}

export interface MeineDatenDoc extends MeineDaten, Document {
  createdAt: Date;
  updatedAt: Date;
}

const meineDatenSchema = new Schema<MeineDatenDoc>(
  {
    // userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    text: { type: String },
  },
  { timestamps: true },
);

const _meineDatenModel = model<MeineDatenDoc>("MeineDaten", meineDatenSchema);

export default _meineDatenModel;
