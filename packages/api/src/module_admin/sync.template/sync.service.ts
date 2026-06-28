import bcrypt from "bcrypt";
import QRCode from "qrcode";
import { CompanyModel, JobModel, CityModel, IndustryModel } from "../../models";

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Builds the same QR code AzubiB2B uses for native companies, so the QR for a
 * Fachzubi company points at the existing deep-link flow already shipped in the
 * mobile apps: BACKEND_URL/qr/fallback.html?companyId=<azubi company _id>.
 */
const buildCompanyQrCode = async (companyId: string): Promise<string> =>
  QRCode.toDataURL(
    `${process.env.BACKEND_URL}/qr/fallback.html?companyId=${companyId}`,
  );

export interface FachzubiCompanyPayload {
  fachzubiId: string;
  companyName: string;
  email: string;
  contactPerson?: string;
  phoneNo?: string;
  address?: string;
  companyDescription?: string;
  website?: string;
  status?: boolean;
  // rich detail (snapshot from Fachzubi)
  jobTitle?: string;
  zipCode?: string;
  videoLink?: string[];
  industryName?: string;
  cityName?: string;
  cityAddress?: string;
  cityZipCode?: string;
  regionName?: string;
  logoUrl?: string | null;
  companyImages?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface FachzubiJobPayload {
  fachzubiId: string;
  fachzubiCompanyId: string;
  jobTitle: string;
  email: string;
  additionalEmail?: string;
  address?: string;
  zipCode?: string;
  jobDescription?: string;
  startDate?: string;
  status?: boolean;
  // rich detail (snapshot from Fachzubi)
  videoLink?: string[];
  companyName?: string;
  cityNames?: string[];
  industryNames?: string[];
  industryName?: string;
  regionName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export class SyncService {
  /** Find a City by (case-insensitive) name, creating it if it doesn't exist. */
  private async resolveCityId(name?: string, address?: string) {
    const cityName = (name ?? "").trim();
    if (!cityName) return null;
    let city = await CityModel.findOne({
      name: { $regex: `^${escapeRegex(cityName)}$`, $options: "i" },
      isDeleted: false,
    });
    if (!city) {
      city = await CityModel.create({
        name: cityName,
        address: address ?? "",
        status: true,
        isDeleted: false,
      });
    }
    return city._id;
  }

  /** Find an Industry by (case-insensitive) name, creating it if it doesn't exist. */
  private async resolveIndustryId(name?: string) {
    const industryName = (name ?? "").trim();
    if (!industryName) return null;
    let industry = await IndustryModel.findOne({
      industryName: { $regex: `^${escapeRegex(industryName)}$`, $options: "i" },
      isDeleted: false,
    });
    if (!industry) {
      industry = await IndustryModel.create({
        industryName,
        status: true,
        isDeleted: false,
      });
    }
    return industry._id;
  }

  public async upsertCompany(data: FachzubiCompanyPayload) {
    // Resolve / create the related city & industry so the Fachzubi company is a
    // first-class AzubiB2B company with proper references (not just metadata).
    const [cityId, industryId] = await Promise.all([
      this.resolveCityId(data.cityName, data.cityAddress),
      this.resolveIndustryId(data.industryName),
    ]);

    const companyImages = Array.isArray(data.companyImages)
      ? data.companyImages.map((file) => ({ file }))
      : [];

    // Only the fields with no dedicated schema home live in fachzubiMeta.
    const fachzubiMeta = {
      jobTitle: data.jobTitle ?? "",
      zipCode: data.zipCode ?? data.cityZipCode ?? "",
      videoLink: Array.isArray(data.videoLink) ? data.videoLink : [],
      regionName: data.regionName ?? "",
    };

    const fields: Record<string, unknown> = {
      companyname: data.companyName,
      email: data.email,
      contactPerson: data.contactPerson ?? "",
      phoneNumber: data.phoneNo ?? "",
      location: data.address ?? "",
      description: data.companyDescription ?? "",
      websiteLink: data.website ?? "",
      profileIcon: data.logoUrl ?? "",
      companyImages,
      source: "fachzubi",
      fachzubiId: data.fachzubiId,
      fachzubiMeta,
      ...(cityId ? { city: cityId } : {}),
      ...(industryId ? { industryName: industryId } : {}),
      ...(typeof data.status === "boolean" ? { status: data.status } : {}),
    };

    // Match ONLY by fachzubiId — in Fachzubi multiple companies may legitimately
    // share the same email / name, so those are NOT unique identifiers. The raw
    // collection is used so the lookup also sees soft-deleted docs.
    const coll = CompanyModel.collection;
    const existing = await coll.findOne({ fachzubiId: data.fachzubiId });

    if (existing) {
      await coll.updateOne(
        { _id: existing._id },
        {
          $set: {
            ...fields,
            isDeleted: false,
            deletedAt: null,
            updatedAt: new Date(),
          },
        },
      );
      await this.ensureCompanyQrCode(existing._id);
      return coll.findOne({ _id: existing._id });
    }

    const hashedPassword = await bcrypt.hash(
      Math.random().toString(36) + Date.now().toString(36),
      10,
    );

    const inserted = await coll.insertOne({
      ...fields,
      password: hashedPassword,
      instagram: "",
      twitter: "",
      facebook: "",
      qrCode: "",
      status: typeof data.status === "boolean" ? data.status : true,
      isDeleted: false,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.ensureCompanyQrCode(inserted.insertedId);
    return coll.findOne({ fachzubiId: data.fachzubiId });
  }

  /**
   * Generates and stores the QR code for a Fachzubi company if it doesn't have
   * one yet. Uses the AzubiB2B company _id so it slots straight into the
   * existing app deep-link flow (same as native companies).
   */
  private async ensureCompanyQrCode(companyId: unknown) {
    const coll = CompanyModel.collection;
    const doc = await coll.findOne({ _id: companyId as never });
    if (!doc || doc.qrCode) return;
    try {
      const qrCode = await buildCompanyQrCode(String(companyId));
      await coll.updateOne({ _id: companyId as never }, { $set: { qrCode } });
    } catch {
      // QR generation failure must never block the sync.
    }
  }

  public async upsertJob(data: FachzubiJobPayload) {
    const company = await CompanyModel.findOne({
      fachzubiId: data.fachzubiCompanyId,
    });

    // Resolve / create the related cities & industry as real AzubiB2B records
    // (match by name, create if missing) and link them — same approach as
    // companies, so the job detail page shows them instead of blanks.
    const cityNames = Array.isArray(data.cityNames) ? data.cityNames : [];
    const industryNames = Array.isArray(data.industryNames)
      ? data.industryNames
      : data.industryName
        ? [data.industryName]
        : [];

    const cityIds = (
      await Promise.all(cityNames.map((n) => this.resolveCityId(n)))
    ).filter(Boolean);
    const industryId = industryNames.length
      ? await this.resolveIndustryId(industryNames[0])
      : null;

    const fachzubiMeta = {
      zipCode: data.zipCode ?? "",
      videoLink: Array.isArray(data.videoLink) ? data.videoLink : [],
      companyName: data.companyName ?? "",
      cityNames,
      industryName: data.industryName ?? industryNames.join(", "),
      regionName: data.regionName ?? "",
      additionalEmail: data.additionalEmail ?? "",
    };

    const jobFields: Record<string, unknown> = {
      jobTitle: data.jobTitle,
      email: data.email,
      additionalEmail: data.additionalEmail ?? "",
      address: data.address ?? "",
      locationField: data.address ?? "",
      jobDescription: data.jobDescription ?? "",
      videoLink: Array.isArray(data.videoLink) ? data.videoLink.join(", ") : "",
      phoneNumber: "",
      status: typeof data.status === "boolean" ? data.status : true,
      source: "fachzubi",
      fachzubiId: data.fachzubiId,
      fachzubiMeta,
      city: cityIds,
      ...(industryId ? { industryName: industryId } : {}),
      isDeleted: false,
      updatedAt: new Date(),
    };

    if (data.startDate) {
      jobFields.startDate = new Date(data.startDate);
    }

    if (company) {
      jobFields.companyId = company._id;
    }

    const existing = await JobModel.collection.findOne({
      fachzubiId: data.fachzubiId,
    });

    if (existing) {
      await JobModel.collection.updateOne(
        { fachzubiId: data.fachzubiId },
        { $set: jobFields },
      );
    } else {
      await JobModel.collection.insertOne({
        ...jobFields,
        createdAt: new Date(),
      });
    }

    return JobModel.collection.findOne({ fachzubiId: data.fachzubiId });
  }

  public async deleteCompany(fachzubiId: string) {
    const existing = await CompanyModel.findOne({ fachzubiId });
    if (!existing) return null;
    existing.isDeleted = true;
    await existing.save();
    return existing;
  }

  public async toggleCompanyStatus(id: string) {
    const company = await CompanyModel.findById(id);
    if (!company) return null;
    company.status = !company.status;
    await company.save();
    return company;
  }

  public async deleteJob(fachzubiId: string) {
    // updateOne (not .save()) so we don't trigger full-document validation on
    // synced jobs that may be missing AzubiB2B-required fields.
    const res = await JobModel.updateOne(
      { fachzubiId },
      { $set: { isDeleted: true, deletedAt: new Date() } },
    );
    return res.modifiedCount > 0 ? { fachzubiId } : null;
  }

  public async toggleJobStatus(id: string) {
    const job = await JobModel.findById(id);
    if (!job) return null;
    const newStatus = !job.status;
    await JobModel.updateOne({ _id: id }, { $set: { status: newStatus } });
    return { _id: id, status: newStatus };
  }

  public async getFachzubiJobById(id: string) {
    return JobModel.findOne({ _id: id, source: "fachzubi" })
      .populate("companyId", "companyname email profileIcon")
      .populate("city", "name")
      .populate("industryName", "industryName");
  }

  public async getFachzubiCompanies(page: number, recordPerPage: number) {
    const skip = (page - 1) * recordPerPage;
    const filter = { source: "fachzubi", isDeleted: false };

    const [companies, total] = await Promise.all([
      CompanyModel.find(filter)
        .select("-password")
        .populate("city", "name address")
        .populate("industryName", "industryName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(recordPerPage),
      CompanyModel.countDocuments(filter),
    ]);

    return {
      companies,
      pagination: {
        totalRecords: total,
        totalPages: Math.ceil(total / recordPerPage),
        currentPage: page,
        pageSize: recordPerPage,
      },
    };
  }

  public async getFachzubiCompanyById(id: string) {
    return CompanyModel.findOne({ _id: id, source: "fachzubi" })
      .select("-password")
      .populate("city", "name address")
      .populate("industryName", "industryName");
  }

  public async getFachzubiJobs(page: number, recordPerPage: number) {
    const skip = (page - 1) * recordPerPage;
    const filter = { source: "fachzubi", isDeleted: false };

    const [jobs, total] = await Promise.all([
      JobModel.find(filter)
        .populate("companyId", "companyname email")
        .populate("city", "name")
        .populate("industryName", "industryName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(recordPerPage),
      JobModel.countDocuments(filter),
    ]);

    return {
      jobs,
      pagination: {
        totalRecords: total,
        totalPages: Math.ceil(total / recordPerPage),
        currentPage: page,
        pageSize: recordPerPage,
      },
    };
  }
}
