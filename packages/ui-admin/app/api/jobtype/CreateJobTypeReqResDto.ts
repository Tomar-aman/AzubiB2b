export interface CreateJobTypeRequestDto {
  companyId: string;
  jobTypeName: string;
}

export interface JobType {
  _id: string;
  jobTypeName: string;
}

export interface TransformRegionTypeAdd {
  _id: string;
  jobTypeName: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface TransformJobTypeForFilters {
  data: JobType[];
  count: number;
}

export interface getAllJobTypes {
  searchValue: string;
  pageNo: number;
  recordPerPage: string;
}
export interface PaginationPayload extends getAllJobTypes { }
