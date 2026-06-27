export interface ManageCompanyType {
  _id: string;
  companyId: string;
  jobListingPage?: string[];
  jobWall?: string[];
  sideMenu?: string[];
  manageAppColor?: string;
  manageJobAlarm?: string;
  manageIndustries?: string;
  manageCities?: string;
  manageBanners?: string;
  createdAt: string;
  updatedAt: string;
}
