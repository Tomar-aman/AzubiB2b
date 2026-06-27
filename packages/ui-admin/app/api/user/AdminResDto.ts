export interface AdminResponseDto {
  _id: string;
  profileIcon: string;
  companyname: string;
  email: string;
  location: string;
  phoneNumber: string;
  websiteLink: string;
  instagram: string;
  twitter: string;
  facebook: string;
  description: string;
}
export interface UpdateProfileRequestDto {
  profileIcon: string;
  companyname: string;
  email: string;
  password: string;
  oldPassword: string;
}
