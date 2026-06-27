export interface CreateIndustryRequestDto {
  companyId: string;
  industryName: string;
}

export interface Industry {
  _id: string;
  industryName: string;
}

export interface TransformRegionTypeAdd {
  _id: string;
  industryName: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface TransformIndustryForFilters {
  data: Industry[];
  count: number;
}

export interface getAllIndustries {
  searchValue: string;
  pageNo: number;
  recordPerPage: string;
}
export interface PaginationPayload extends getAllIndustries { }
