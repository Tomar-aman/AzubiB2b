export interface CreateCityRequestDto {
  companyId: string;
  name: string;
  address: string;
  status?: boolean;
}

export interface City {
  _id: string;
  name: string;
  address: string;
  status?: boolean;
}

export interface TransformCity {
  _id: string;
  name: string;
  address: string;
  status: boolean;
}

export interface TransformCityForFilters {
  data: TransformCity[];
  count: number;
}

export interface getAllCitiesType {
  searchValue: string;
  pageNo: number;
  recordPerPage: string;
}
export interface PaginationPayload extends getAllCitiesType {}
