"use client";
import MainLayout from "@/components/layout";
import React, { useEffect, useState } from "react";
import StylesStyled from "./stylesStyled";
import { Box } from "@mui/material";
import { SVG } from "@/assets/svg";
import TextInput from "@/components/labelInput";
import FilledButton from "@/components/button";
import { useRouter } from "next/navigation";
import BasicSelect from "@/components/selectdropdown";
import { AuthApi } from "@/app/api/auth/AuthApi";
import { JobApi } from "@/app/api/jobs/JobApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminApi } from "@/app/api/user/AdminApi";
import MultipleUploadPicture from "@/components/multipleUploadfile";
import QuillEditor from "@/components/textarea";
import { useAppSelector } from "@monorepo/ui-core/src/redux/hooks";

interface Company {
  _id: string;
  createdAt: string;
  companyname: string;
  email: string;
  contactPerson: string;
  phoneNumber: string;
  industryName: string;
  city: string;
  status: string;
  companyImages: any[];
  location: string;
  websiteLink: string;
  instagram: string;
  twitter: string;
  facebook: string;
  description: string;
}

export default function AddNewCompany() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cityList, setCityList] = useState<any>([]);
  const [industriesList, setIndustriesList] = useState<any>([]);
  const [existingServerImages, setExistingServerImages] = useState<any[]>([]);
  const [newFilesToUpload, setNewFilesToUpload] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [companyData, setCompany] = useState<Company>({
    _id: "",
    createdAt: "",
    companyname: "",
    email: "",
    contactPerson: "",
    phoneNumber: "",
    industryName: "",
    city: "",
    status: "",
    companyImages: [],
    location: "",
    websiteLink: "",
    instagram: "",
    twitter: "",
    facebook: "",
    description: "",
  });

  const { company } = useAppSelector((state) => state.globalCache);
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const handleIndustriesData = async () => {
    const response: any = await JobApi.getindustryData(company._id);

    if (response?.remote === "success") {
      setIndustriesList(response.data.data.industries);
    } else {
      return response?.error;
    }
  };

  const handleCityData = async () => {
    const response: any = await JobApi.getcityData(company._id);
    if (response?.remote === "success") {
      setCityList(response.data.data.cities);
    } else {
      return response?.error;
    }
  };

  const handleFileChange = (files: File[] | null, existingImages: string[]) => {

    if (files && files.length > 0) {
      setNewFilesToUpload(files);

      // Create previews for the new files
      const previews: string[] = [];
      let loaded = 0;

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result as string);
          loaded++;

          if (loaded === files.length) {
            setNewImagePreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      setNewFilesToUpload([]);
      setNewImagePreviews([]);
    }
  };

  const handleCompany = async () => {
    try {
      setLoading(true);
      const response: any = await AdminApi.getCompanyData();
      if (response?.remote === "success") {
        const data = response.data.data;
        setCompany(data);

        if (
          Array.isArray(data.companyImages) &&
          data.companyImages.length > 0
        ) {
          setExistingServerImages(data.companyImages);
        } else {
          setExistingServerImages([]);
        }
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompany((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const {
        companyname,
        email,
        contactPerson,
        phoneNumber,
        industryName,
        city,
        location,
        websiteLink,
        instagram,
        twitter,
        facebook,
        description,
      } = companyData;

      const formData = new FormData();
      formData.append("companyname", companyname);
      formData.append("email", email);
      formData.append("contactPerson", contactPerson);
      formData.append("phoneNumber", phoneNumber);
      if (industryName) {
        formData.append("industryName", industryName);
      }
      if (city) {
        formData.append("city", city);
      }
      formData.append("location", location);
      formData.append("websiteLink", websiteLink);
      formData.append("instagram", instagram);
      formData.append("twitter", twitter);
      formData.append("facebook", facebook);
      formData.append("description", description);

      // Send existing images as JSON so backend knows to keep them
      formData.append("existingImages", JSON.stringify(existingServerImages));

      // Append only NEW files
      if (newFilesToUpload && newFilesToUpload.length > 0) {
        newFilesToUpload.forEach((file: File) => {
          formData.append("companyImages[]", file);
        });
      }

      const response = await AuthApi.updateCompany(formData);

      if (response.remote === "success") {
        toast.success("Company updated successfully!");
        setNewFilesToUpload([]);
        setNewImagePreviews([]);
        router.push("/manage-company");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("An error occurred while updating company.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleIndustriesData();
    handleCityData();
    handleCompany();
  }, []);

  const items: any = [];
  cityList?.map((item: any) => {
    items.push({
      value: item._id,
      label: item.name,
    });
  });

  const industriesitems: any = [];
  industriesList?.map((item: any) => {
    industriesitems.push({
      value: item._id,
      label: item.industryName,
    });
  });

  const handleGoBack = () => {
    router.back();
  };

  // Create image preview URLs for the child component
  const imagePreviewUrls = [
    ...existingServerImages.map((img: any) => `${baseURL}${img.file}`),
    ...newImagePreviews, // Add new file previews
  ];

  return (
    <StylesStyled>
      <MainLayout>
        <Box sx={{ paddingLeft: "260px" }} className="addNew">
          <Box p={3}>
            <Box className="headerCompany">
              <SVG.Arrow onClick={handleGoBack} style={{ cursor: "pointer" }} />
              <h3>Edit Company</h3>
            </Box>
            <Box className="companyBox">
              <Box className="customLabel">
                <label>Company Name</label>
                <TextInput
                  name="companyname"
                  type="text"
                  placeholder="Enter company name"
                  value={companyData.companyname}
                  onChange={handleChange}
                  disabled={true}
                />
              </Box>
              <Box className="customLabel">
                <label>Email</label>
                <TextInput
                  name="email"
                  type="text"
                  placeholder="Enter email"
                  value={companyData.email}
                />
              </Box>
              <Box className="customLabel">
                <label>Contact Person</label>
                <TextInput
                  name="contactPerson"
                  type="text"
                  placeholder="Add contact person"
                  value={companyData.contactPerson}
                  onChange={handleChange}
                />
              </Box>
              <Box className="customLabel">
                <label>Phone Number</label>
                <TextInput
                  name="phoneNumber"
                  type="text"
                  placeholder="Enter phone number"
                  value={companyData.phoneNumber}
                  onChange={handleChange}
                />
              </Box>
              <Box className="selectLabel">
                <label>Industry</label>
                <BasicSelect
                  items={industriesitems}
                  className="my-select"
                  placeholder="Select"
                  multiple={false}
                  value={companyData.industryName}
                  onValueChange={(e: any) => {
                    setCompany((prev) => ({
                      ...prev,
                      ["industryName"]: e,
                    }));
                  }}
                />
              </Box>
              <Box className="selectLabel">
                <label>City</label>
                <BasicSelect
                  items={items}
                  className="my-select"
                  placeholder="Select an option"
                  multiple={false}
                  value={companyData.city}
                  onValueChange={(e: any) => {
                    setCompany((prev) => ({
                      ...prev,
                      ["city"]: e,
                    }));
                  }}
                />
              </Box>
              <Box className="customLabel">
                <label>Location</label>
                <TextInput
                  name="location"
                  type="text"
                  placeholder="Enter location"
                  value={companyData.location}
                  onChange={handleChange}
                />
              </Box>
              <Box className="customLabel">
                <label>Weblink</label>
                <TextInput
                  name="websiteLink"
                  type="text"
                  placeholder="Enter website link"
                  value={companyData.websiteLink}
                  onChange={handleChange}
                />
              </Box>
              <Box className="customLabel">
                <label>Instagram</label>
                <TextInput
                  name="instagram"
                  type="text"
                  placeholder="Enter instgram link"
                  value={companyData.instagram}
                  onChange={handleChange}
                />
              </Box>
              <Box className="customLabel">
                <label>Facebook</label>
                <TextInput
                  name="facebook"
                  type="text"
                  placeholder="Enter facebook link"
                  value={companyData.facebook}
                  onChange={handleChange}
                />
              </Box>
              <Box className="customLabel">
                <label>Twitter</label>
                <TextInput
                  name="twitter"
                  type="text"
                  placeholder="Enter twitter link"
                  value={companyData.twitter}
                  onChange={handleChange}
                />
              </Box>
              <Box className="customLabel">
                <label>Description</label>
                <QuillEditor
                  onChange={(e: any) => {
                    setCompany((prev: any) => ({
                      ...prev,
                      ["description"]: e,
                    }));
                  }}
                  value={companyData.description}
                />
              </Box>
              <Box className="customLabel">
                <Box
                  className="imageText"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <label>Company Images</label>
                  <MultipleUploadPicture
                    value={imagePreviewUrls}
                    onChange={handleFileChange}
                    companyId={companyData._id}
                    existingServerImages={existingServerImages}
                    onExistingImagesChange={setExistingServerImages}
                  />
                </Box>
              </Box>
              <Box sx={{ textAlign: "end", paddingBottom: "22px" }}>
                <FilledButton
                  className="btnSubmit"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  <SVG.Vector /> {loading ? "Submitting..." : "Submit"}
                </FilledButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </MainLayout>
    </StylesStyled>
  );
}
