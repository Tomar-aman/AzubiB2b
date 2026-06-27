// import mongoose from "mongoose";
import { Schema, model, type Document } from "mongoose";

export interface City {
  // companyId: mongoose.Schema.Types.ObjectId;
  name: string;
  isDeleted: boolean;
  address: string;
  status: boolean;
}

export interface CityDocument extends City, Document {
  createdAt: Date;
  updatedAt: Date;
}

const citySchema = new Schema<CityDocument>(
  {
    // companyId: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
    address: { type: String },
    status: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
  },
);

const _cityModel = model<CityDocument>("City", citySchema);

export default _cityModel;
