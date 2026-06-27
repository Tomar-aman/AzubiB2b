export interface Attachment {
  path: string; // Path to the file
  filetype: string; // Type of the file, e.g., "image", "pdf"
  createdAt?: Date; // File creation date
}

export interface AdditionalData {
  image?: string; // ObjectId reference as string
  text?: string;
}

export interface UpdateJob {
  companyId?: string;
  jobType?: string;
  city?: string[];
  industryName?: string;
  jobTitle?: string;
  email?: string;
  additionalEmail?: string;
  address?: string;
  mapUrl?: string;
  locationField?: string;
  locationUrl?: string;
  jobDescription?: string;
  attachement?: Attachment;
  videoLink?: string;
  jobImages?: string[];
  embeddedCode?: string;
  additionalData?: AdditionalData[];
}
