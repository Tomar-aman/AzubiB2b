import { Schema, model, type Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface Company {
  userId?: Schema.Types.ObjectId;
  companyname: string;
  email: string;
  password: string;
  contactPerson?: string;
  phoneNumber?: string;
  city?: Schema.Types.ObjectId;
  location: string;
  industryName?: Schema.Types.ObjectId;
  profileIcon?: string;
  companyImages?: string[];
  websiteLink: string;
  instagram: string;
  twitter: string;
  facebook: string;
  description: string;
  qrCode: string;
  status: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  smtpHost?: string;
  smtpPort?: number;
  smtpUserName?: string;
  smtpPassword?: string;
  smtpEncryption?: string;
  smtpAddress?: string;
  smtpService?: string;
  source?: string;
  fachzubiId?: string;
  fachzubiMeta?: Record<string, unknown>;
}

export interface CompanyDocument extends Company, Document {
  createdAt: Date;
  updatedAt: Date;
  updatePassword: (newPassword: string) => Promise<void>;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  deleteCompany: () => Promise<void>;
  restoreCompany: () => Promise<void>;
}

const docsData = new Schema({
  file: {
    type: String,
    default: null,
  },
})

const companySchema = new Schema<CompanyDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    // NOTE: uniqueness is enforced via partial indexes below (only for
    // azubi-native companies). Fachzubi companies may share email/name.
    companyname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    city: { type: Schema.Types.ObjectId, ref: "City" },
    location: { type: String, required: false },
    industryName: {
      type: Schema.Types.ObjectId,
      ref: "Industries",
    },
    profileIcon: { type: String, default: "" },
    companyImages: { type: [docsData], default: [] },
    websiteLink: { type: String, default: "" },
    instagram: { type: String, default: "" },
    twitter: { type: String, default: "" },
    facebook: { type: String, default: "" },
    description: { type: String, default: "" },
    phoneNumber: {
      type: String,
      min: [10, "Phone Number shouldn't less than 10"],
      default: "",
    },
    contactPerson: { type: String, default: "" },
    qrCode: {
      type: String,
      default: null,
    },
    status: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    smtpHost: { type: String },
    smtpPort: { type: Number },
    smtpUserName: { type: String },
    smtpPassword: { type: String },
    smtpEncryption: { type: String, default: "" },
    smtpAddress: { type: String, default: "" },
    smtpService: { type: String, default: "" },
    source: { type: String, enum: ["azubi", "fachzubi"], default: "azubi" },
    fachzubiId: { type: String, default: null },
    // Snapshot of the full Fachzubi company detail (industry, city, region,
    // logo URL, gallery images, etc.) shown on the Fachzubi company detail page.
    fachzubiMeta: { type: Schema.Types.Mixed, default: null },
  },
  {
    timestamps: true,
  },
);

// Enforce unique email / companyname ONLY for azubi-native companies.
// Fachzubi-sourced companies are directory entries and may legitimately
// share an email or name, so they are excluded from these unique indexes.
companySchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { source: "azubi" }, name: "email_azubi_unique" },
);
companySchema.index(
  { companyname: 1 },
  { unique: true, partialFilterExpression: { source: "azubi" }, name: "companyname_azubi_unique" },
);

companySchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
    return;
  }
  try {
    const hashed = await bcrypt.hash(this.get("password"), 10);
    this.set("password", hashed);
    next();
  } catch (err: any) {
    next(err);
  }
});

companySchema.methods.getJwtToken = function () {
  if (!process.env.SECRET_KEY) {
    throw new Error("SECRET KEY is requred");
  }
  return jwt.sign({ id: this._id }, process.env.SECRET_KEY, {
    expiresIn: "30d",
  });
};

companySchema.methods.updatePassword = async function (newPassword: string) {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  this.password = hashedPassword; // Update the hashed password
  await this.save(); // Save the updated user document
};

companySchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

// Soft delete method
companySchema.methods.deleteCompany = async function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  await this.save();
};

// Restore method (undo soft delete)
companySchema.methods.restoreCompany = async function () {
  this.isDeleted = false;
  this.deletedAt = null;
  await this.save();
};

companySchema.pre("find", function () {
  void this.where({ isDeleted: false });
});

companySchema.pre("findOne", function () {
  void this.where({ isDeleted: false });
});

const _companyModel = model<CompanyDocument>("Company", companySchema);
export default _companyModel;
