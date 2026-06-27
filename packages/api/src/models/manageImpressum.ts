import { model, Schema, type Document } from "mongoose";

export interface Impressum {
    description: string;
};

export interface ImpressumDoc extends Impressum, Document {
    createdAt: Date;
    updatedAt: Date;
};

const impressumSchema = new Schema<ImpressumDoc>(
    { description: { type: String } },
    { timestamps: true }
);

const _impressumModel = model<ImpressumDoc>("Impressum", impressumSchema);
export default _impressumModel;