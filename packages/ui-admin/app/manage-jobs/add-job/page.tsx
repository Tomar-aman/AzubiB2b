/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import AddJobStyled from "./addjobStyled";
import MainLayout from "@/components/layout";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { SVG } from "@/assets/svg";
import { useRouter, useSearchParams } from "next/navigation";
import FilledButton from "@/components/button";
import BasicSelect from "@/components/selectdropdown";
import TextInput from "@/components/labelInput";
import Grid from "@mui/material/Grid2";
import QuillEditor from "@/components/textarea";
import { JobApi } from "@/app/api/jobs/JobApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppSelector } from "@monorepo/ui-core/src/redux/hooks";
import MultipleUploadPicture from "@/components/multipleUploadfile";
import { Sidemenu } from "@/app/api/sidemenu/SidemenuApi";
import { CityApi } from "@/app/api/city/CityApi";
import { IndustryApi } from "@/app/api/industry/IndustryApi";
import { JobTypeApi } from "@/app/api/jobtype/JobTypeApi";

const Required = () => <span style={{ color: "red" }}> *</span>;

export default function AddJob() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const copyid = searchParams.get("copyid");
  const viewid = searchParams.get("viewid");
  const { company } = useAppSelector((state) => state.globalCache);

  const [jobList, setJobList] = useState<any>([]);
  const [cityList, setCityList] = useState<any>([]);
  const [industriesList, setIndustriesList] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  // Job Images state - similar to company images
  const [existingJobImages, setExistingJobImages] = useState<any[]>([]);
  const [newJobImagesToUpload, setNewJobImagesToUpload] = useState<File[]>([]);
  const [newJobImagePreviews, setNewJobImagePreviews] = useState<string[]>([]);

  // Attachments state - similar to company images
  const [existingAttachments, setExistingAttachments] = useState<any[]>([]);
  const [newAttachmentsToUpload, setNewAttachmentsToUpload] = useState<File[]>([]);
  const [newAttachmentPreviews, setNewAttachmentPreviews] = useState<string[]>([]);

  // Popup states
  const [jobTypePopup, setJobTypePopup] = useState(false);
  const [cityPopup, setCityPopup] = useState(false);
  const [industryPopup, setIndustryPopup] = useState(false);

  // Popup form data
  const [newJobType, setNewJobType] = useState({ jobTypeName: "" });
  const [newCity, setNewCity] = useState({ name: "", address: "" });
  const [newIndustry, setNewIndustry] = useState({ industryName: "" });

  const [jobData, setJobData] = useState({
    companyId: "",
    jobType: "",
    city: [],
    industryName: "",
    jobTitle: "",
    phoneNumber: "",
    email: "",
    additionalEmail: "",
    address: "",
    mapUrl: "",
    locationField: "",
    locationUrl: "",
    jobDescription: "",
    videoLink: "",
    embeddedCode: "",
    additionalData: [],
  });

  const [iconList, setIconList] = useState<any>([]);
  const [fields, setFields] = useState<
    { id: number; file: string; text: string }[]
  >([]);
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  // Handle Job Images file change
  const handleFileJobChange = (files: File[] | null, existingImages: string[]) => {
    if (files && files.length > 0) {
      setNewJobImagesToUpload(files);

      // Create previews for the new files
      const previews: string[] = [];
      let loaded = 0;

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result as string);
          loaded++;

          if (loaded === files.length) {
            setNewJobImagePreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      setNewJobImagesToUpload([]);
      setNewJobImagePreviews([]);
    }
  };

  // Handle Attachments file change
  const handleFileAttachmentChange = (files: File[] | null, existingImages: string[]) => {
    if (files && files.length > 0) {
      setNewAttachmentsToUpload(files);

      // Create previews for the new files
      const previews: string[] = [];
      let loaded = 0;

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result as string);
          loaded++;

          if (loaded === files.length) {
            setNewAttachmentPreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      setNewAttachmentsToUpload([]);
      setNewAttachmentPreviews([]);
    }
  };

  // Handle adding a new field
  const handleAddField = () => {
    const newField = { id: fields.length + 1, file: "", text: "" };
    setFields([...fields, newField]);
  };

  // Handle deleting a specific field
  const handleDeleteField = (id: number) => {
    const updatedFields = fields.filter((field) => field.id !== id);
    setFields(updatedFields);
  };

  const handleGetIcons = async () => {
    setLoading(true);
    const response: any = await Sidemenu.getIcons();

    if (response?.remote === "success") {
      const formattedIcons = response.data.data.map((item: any) => ({
        value: item.icon,
        label: item.icon,
        preview: `${baseURL}/${item.icon}`,
      }));

      setIconList(formattedIcons);
    } else {
      return response?.error;
    }
    setLoading(false);
  };

  useEffect(() => {
    handleGetIcons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle text input change
  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
  ) => {
    const updatedFields = fields.map((field) =>
      field.id === id ? { ...field, text: e.target.value } : field,
    );
    setFields(updatedFields);
  };

  //list of city company and jobtype
  const handleJobTypes = async () => {
    const response: any = await JobApi.getjobTypeData(company?._id);

    if (response?.remote === "success") {
      setJobList(response.data.data.jobTypes);
    } else {
      return response?.error;
    }
  };

  const handleCityData = async () => {
    const response: any = await JobApi.getcityData(company?._id);

    if (response?.remote === "success") {
      const cities = response.data.data.cities;
      setCityList(cities);
    } else {
      return response?.error;
    }
  };

  const handleIndustriesData = async () => {
    const response: any = await JobApi.getindustryData(company?._id);

    if (response?.remote === "success") {
      setIndustriesList(response.data.data.industries);
    } else {
      return response?.error;
    }
  };

  const handleGetJob = async (id: string) => {
    try {
      setLoading(true);
      const response = await JobApi.getJobData(id);

      if (response.remote === "success") {
        const data = response.data.data;

        setFields(data.additionalData);
        setJobData({
          companyId: data.company,
          jobType: data.jobType,
          city: data.cities,
          industryName: data.industry,
          jobTitle: data.jobTitle,
          phoneNumber: data.phoneNumber,
          email: data.email,
          additionalEmail: data.additionalEmail,
          address: data.address,
          mapUrl: data.mapUrl,
          locationField: data.locationField,
          locationUrl: data.locationUrl,
          jobDescription: data.jobDescription,
          videoLink: data.videoLink,
          embeddedCode: data.embeddedCode,
          additionalData: data.additionalData,
        });

        // Set existing attachments
        if (Array.isArray(data.attachement) && data.attachement.length > 0) {
          setExistingAttachments(data.attachement);
        } else {
          setExistingAttachments([]);
        }

        // Set existing job images
        if (Array.isArray(data.jobImages) && data.jobImages.length > 0) {
          setExistingJobImages(data.jobImages);
        } else {
          setExistingJobImages([]);
        }
      }
    } catch (error) {
      console.error("Error fetching job data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (copyid) {
      handleGetJob(copyid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copyid]);

  useEffect(() => {
    if (viewid) {
      handleGetJob(viewid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewid]);

  useEffect(() => {
    if (id) {
      handleGetJob(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (company) {
      handleJobTypes();
      handleIndustriesData();
      handleCityData();
      setJobData((prevState) => ({
        ...prevState,
        companyId: company._id,
        email: company.email
      }));
    }
  }, [company]);

  const items: any = [];
  jobList?.map((item: any) => {
    items.push({
      value: item._id,
      label: item.jobTypeName,
    });
  });
  const cityitems: any = [];
  cityList?.map((item: any) => {
    cityitems.push({
      value: item._id,
      label: item.name,
      status: item.status,
    });
  });
  const industriesitems: any = [];
  industriesList?.map((item: any) => {
    industriesitems.push({
      value: item._id,
      label: item.industryName,
    });
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setJobData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const {
        companyId,
        jobType,
        city,
        industryName,
        jobTitle,
        phoneNumber,
        email,
        additionalEmail,
        address,
        mapUrl,
        locationField,
        locationUrl,
        jobDescription,
        videoLink,
        embeddedCode,
        additionalData,
      } = jobData;

      // Validation
      if (!city || city.length === 0) {
        toast.error("City is required.");
        setLoading(false);
        return;
      }
      if (!industryName) {
        toast.error("Industry name is required.");
        setLoading(false);
        return;
      }
      if (!jobTitle) {
        toast.error("Job title is required.");
        setLoading(false);
        return;
      }
      if (!phoneNumber) {
        toast.error("Phone number is required");
        setLoading(false);
        return;
      }
      if (!email) {
        toast.error("Email is required.");
        setLoading(false);
        return;
      }
      if (!address) {
        toast.error("Address is required.");
        setLoading(false);
        return;
      }
      if (!locationField) {
        toast.error("Location field is required.");
        setLoading(false);
        return;
      }
      if (!jobDescription) {
        toast.error("Job description is required.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("companyId", companyId);
      formData.append("jobType", jobType);
      formData.append("city", JSON.stringify(city));
      formData.append("industryName", industryName);
      formData.append("jobTitle", jobTitle);
      formData.append("phoneNumber", phoneNumber);
      formData.append("email", email);
      formData.append("additionalEmail", additionalEmail);
      formData.append("address", address);
      formData.append("mapUrl", mapUrl);
      formData.append("locationField", locationField);
      formData.append("locationUrl", locationUrl);
      formData.append("jobDescription", jobDescription);
      formData.append("videoLink", videoLink);
      formData.append("embeddedCode", embeddedCode);
      formData.append("additionalData", JSON.stringify(additionalData));

      formData.append("existingAttachments", JSON.stringify(existingAttachments));

      // Append only NEW attachment files
      if (newAttachmentsToUpload && newAttachmentsToUpload.length > 0) {
        newAttachmentsToUpload.forEach((file: File) => {
          formData.append("attachement[]", file);
        });
      }

      // Handle Job Images - send existing images as JSON
      formData.append("existingJobImages", JSON.stringify(existingJobImages));

      // Append only NEW job image files
      if (newJobImagesToUpload && newJobImagesToUpload.length > 0) {
        newJobImagesToUpload.forEach((file: File) => {
          formData.append("jobImages[]", file);
        });
      }

      if (id) {
        const response = await JobApi.updateJob(id as any, formData as any);

        if (response.remote === "success") {
          toast.success("Job updated successfully!");
          setNewJobImagesToUpload([]);
          setNewJobImagePreviews([]);
          setNewAttachmentsToUpload([]);
          setNewAttachmentPreviews([]);
          router.push("/manage-jobs");
        }
      } else {
        const response = await JobApi.addJobs(formData);

        if (response.remote === "success") {
          toast.success("Job added successfully!");
          router.push("/manage-jobs");
        }
      }
    } catch (error) {
      console.error("Error updating jobs:", error);
      toast.error("An error occurred while updating jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setJobData((prev: any) => ({
      ...prev,
      ["additionalData"]: fields,
    }));
  }, [fields]);

  const handleGoBack = () => {
    router.back();
  };

  // Create image preview URLs for Job Images
  const jobImagePreviewUrls = [
    ...existingJobImages.map((img: any) => `${baseURL}${img.file}`),
    ...newJobImagePreviews,
  ];

  // Create image preview URLs for Attachments
  const attachmentPreviewUrls = [
    ...existingAttachments.map((img: any) => `${baseURL}${img.file}`),
    ...newAttachmentPreviews,
  ];

  // Popup handlers
  const handleJobTypePopupOpen = () => setJobTypePopup(true);
  const handleJobTypePopupClose = () => {
    setJobTypePopup(false);
    setNewJobType({ jobTypeName: "" });
  };

  const handleCityPopupOpen = () => setCityPopup(true);
  const handleCityPopupClose = () => {
    setCityPopup(false);
    setNewCity({ name: "", address: "" });
  };

  const handleIndustryPopupOpen = () => setIndustryPopup(true);
  const handleIndustryPopupClose = () => {
    setIndustryPopup(false);
    setNewIndustry({ industryName: "" });
  };

  // Submit handlers for popups
  const handleJobTypeSubmit = async () => {
    try {
      setLoading(true);
      const { jobTypeName } = newJobType;
      if (!jobTypeName) {
        toast.error("JobType name is required.");
        return;
      }

      const response = await JobTypeApi.addJobType({
        companyId: company?._id,
        jobTypeName,
      });

      if (response.remote === "success") {
        toast.success("Company added successfully!");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("An error occurred while updating company.");
    } finally {
      setLoading(false);
      handleJobTypePopupClose();
      handleJobTypes();
    }
  };

  const handleCitySubmit = async () => {
    try {
      setLoading(true);
      const { name, address } = newCity;

      if (!name) {
        toast.error("Name is required.");
        return;
      }

      const response = await CityApi.addCity({
        companyId: company?._id,
        name,
        address,
      });
      if (response.remote === "success") {
        toast.success("City added successfully!");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("An error occurred while updating city.");
    } finally {
      setLoading(false);
      handleCityPopupClose();
      handleCityData();
    }
  };

  const handleIndustrySubmit = async () => {
    try {
      setLoading(true);
      const { industryName } = newIndustry;
      if (!industryName) {
        toast.error("Industry name is required.");
        return;
      }
      const response = await IndustryApi.addIndustry({
        companyId: company?._id,
        industryName,
      });
      if (response.remote === "success") {
        toast.success("Industry added successfully!");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("An error occurred while updating industry.");
    } finally {
      setLoading(false);
      handleIndustryPopupClose();
      handleIndustriesData();
    }
  };

  return (
    <AddJobStyled>
      <ToastContainer />
      <MainLayout>
        <Box sx={{ paddingLeft: "260px" }} className="addNew">
          <Box p={3}>
            <Box className="headerCompany">
              <SVG.Arrow onClick={handleGoBack} style={{ cursor: "pointer" }} />
              <h3>Add Job</h3>
            </Box>
            <Box className="companyBox">
              <Box className="selectLabel">
                <label>Type of job
                  <Required />
                </label>
                <BasicSelect
                  items={items}
                  className="my-select"
                  labels="Select "
                  multiple={false}
                  value={jobData.jobType}
                  disabled={viewid ? true : false}
                  onValueChange={(e: any) => {
                    setJobData((prev) => ({
                      ...prev,
                      ["jobType"]: e,
                    }));
                  }}
                />
                <Button onClick={handleJobTypePopupOpen} style={{ minWidth: '150px' }} className="addTextBtn">
                  Add Job Type
                </Button>
              </Box>
              <Box className="selectLabel">
                <label>City
                  <Required />
                </label>
                <BasicSelect
                  items={cityitems.filter((city: any) => city.status === true)}
                  className="my-select"
                  labels="Select City"
                  placeholder="Select City"
                  multiple={true}
                  value={jobData.city}
                  disabled={viewid ? true : false}
                  onValueChange={(e: any) => {
                    setJobData((prev) => ({
                      ...prev,
                      ["city"]: e,
                    }));
                  }}
                />
                <Button onClick={handleCityPopupOpen} style={{ minWidth: '150px' }}>
                  Add City
                </Button>
              </Box>
              <Box className="selectLabel">
                <label>Industries
                  <Required />
                </label>
                <BasicSelect
                  items={industriesitems}
                  className="my-select"
                  labels="Select Industries"
                  multiple={false}
                  value={jobData.industryName}
                  disabled={viewid ? true : false}
                  onValueChange={(e: any) => {
                    setJobData((prev) => ({
                      ...prev,
                      ["industryName"]: e,
                    }));
                  }}
                />
                <Button onClick={handleIndustryPopupOpen} style={{ minWidth: '150px' }}>
                  Add Industry
                </Button>
              </Box>
              <Box className="customLabel">
                <label>Job Title
                  <Required />
                </label>
                <TextInput
                  name="jobTitle"
                  type="text"
                  placeholder="Enter job title"
                  value={jobData.jobTitle}
                  onChange={handleChange}
                  autocomplete="off"
                  disabled={viewid ? true : false}
                />
              </Box>
              <Box className="customLabel">
                <label>Phone number
                  <Required />
                </label>
                <TextInput
                  name="phoneNumber"
                  type="text"
                  placeholder="Enter phone no."
                  value={jobData.phoneNumber}
                  onChange={handleChange}
                  autocomplete="off"
                  disabled={viewid ? true : false}
                />
              </Box>
              <Box className="customLabel">
                <label>Email Id
                  <Required />
                </label>
                <TextInput
                  type="text"
                  placeholder="Enter your email"
                  name="email"
                  value={jobData.email}
                  disabled={viewid ? true : false}
                />
              </Box>
              <Box className="customLabel">
                <label>Additional Email</label>
                <TextInput
                  type="text"
                  placeholder="Enter additional email"
                  name="additionalEmail"
                  value={jobData.additionalEmail}
                  onChange={handleChange}
                  autocomplete="off"
                  disabled={viewid ? true : false}
                />
              </Box>
              <Box className="customLabel">
                <label>Address
                  <Required />
                </label>
                <TextInput
                  type="text"
                  placeholder="Enter address"
                  name="address"
                  value={jobData.address}
                  onChange={handleChange}
                  autocomplete="off"
                  disabled={viewid ? true : false}
                />
              </Box>
              <Box className="customLabel">
                <label>Google Map Url</label>
                <TextInput
                  type="text"
                  placeholder="Enter url"
                  name="mapUrl"
                  value={jobData.mapUrl}
                  onChange={handleChange}
                  autocomplete="off"
                  disabled={viewid ? true : false}
                />
              </Box>
              <Box className="customLabel">
                <label>Location
                  <Required />
                </label>
                <TextInput
                  type="text"
                  placeholder="Enter a Location"
                  name="locationField"
                  value={jobData.locationField}
                  onChange={handleChange}
                  autocomplete="off"
                  disabled={viewid ? true : false}
                />
              </Box>
              <Box className="customLabel">
                <label>Location Url</label>
                <TextInput
                  type="text"
                  placeholder="Enter a Location Url"
                  name="locationUrl"
                  value={jobData.locationUrl}
                  onChange={handleChange}
                  autocomplete="off"
                  disabled={viewid ? true : false}
                />
              </Box>
              <Box className="customLabel">
                <label>Job Description
                  <Required />
                </label>
                <QuillEditor
                  onChange={(e: any) => {
                    setJobData((prev) => ({
                      ...prev,
                      ["jobDescription"]: e,
                    }));
                  }}
                  value={jobData.jobDescription}
                />
              </Box>
              {/* <Box className="customLabel">
                <Box
                  className="imageText"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <label>Attachments</label>
                  <MultipleUploadPicture
                    value={attachmentPreviewUrls}
                    onChange={handleFileAttachmentChange}
                    jobId={id}
                    existingServerImages={existingAttachments}
                    onExistingImagesChange={setExistingAttachments}
                    type="attachement"
                    disabled={viewid ? true : false}
                  />
                </Box>
              </Box> */}
              {/* <Box className="customLabel">
                <label>YouTube link</label>
                <TextInput
                  type="text"
                  name="videoLink"
                  placeholder="Enter a Youtube Link"
                  value={jobData.videoLink}
                  onChange={handleChange}
                  autocomplete="off"
                  disabled={viewid ? true : false}
                />
              </Box> */}
              <Box className="customLabel">
                <Box
                  className="imageText"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <label>Job Images</label>
                  <MultipleUploadPicture
                    value={jobImagePreviewUrls}
                    onChange={handleFileJobChange}
                    jobId={id}
                    existingServerImages={existingJobImages}
                    onExistingImagesChange={setExistingJobImages}
                    type="image"
                    disabled={viewid ? true : false}
                  />
                </Box>
              </Box>
              <Box className="customLabel">
                <label>Embedded Code</label>
                <TextInput
                  type="text"
                  name="embeddedCode"
                  value={jobData.embeddedCode}
                  placeholder="Embedded Code"
                  onChange={handleChange}
                  autocomplete="off"
                  disabled={viewid ? true : false}
                />
              </Box>
              <Box className="additionalFIeld">
                <h5 onClick={viewid ? undefined : handleAddField} style={{ cursor: "pointer" }}>
                  +Add Additional Field
                </h5>
                <Grid container spacing={2} sx={{ marginBottom: "20px" }}>
                  {fields.map((field) => (
                    <React.Fragment key={field.id}>
                      <Grid
                        size={5.4}
                        sx={{ display: "flex", alignItems: "end" }}
                      >
                        <Box
                          className="selectLabel"
                          sx={{ width: "100%", margin: "0 !important" }}
                        >
                          <BasicSelect
                            items={iconList.map((item: any) => ({
                              value: item.value,
                              label: (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                  }}
                                >
                                  <img
                                    src={item.preview}
                                    alt="icon"
                                    width={24}
                                    height={24}
                                  />
                                </div>
                              ),
                            }))}
                            className="my-select width-40px"
                            labels="Select"
                            multiple={false}
                            value={
                              fields.find((f) => f.id === field.id)?.file || ""
                            }
                            onValueChange={(e: any) => {
                              setFields((prevFields) =>
                                prevFields.map((f) =>
                                  f.id === field.id ? { ...f, file: e } : f,
                                ),
                              );
                            }}
                            disabled={viewid ? true : false}
                          />
                          {/* {iconList.length === 0 && (
                            <Box sx={{
                              marginTop: "8px",
                              color: "#ff6b6b",
                              fontSize: "12px",
                              fontStyle: "italic"
                            }}>
                              To add options add content in side menu content section!
                            </Box>
                          )} */}
                        </Box>
                      </Grid>
                      <Grid size={0.2}></Grid>
                      <Grid
                        size={5.4}
                        sx={{ display: "flex", alignItems: "end" }}
                      >
                        <Box
                          className="customLabel"
                          sx={{ width: "100%", margin: "0 !important" }}
                        >
                          <TextInput
                            type="text"
                            placeholder="Enter Text"
                            value={field.text}
                            onChange={(e) => handleTextChange(e, field.id)}
                            autocomplete="off"
                          />
                        </Box>
                      </Grid>
                      <Grid size={1}>
                        <Box
                          className="deleteText"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDeleteField(field.id)}
                        >
                          Delete
                        </Box>
                      </Grid>
                    </React.Fragment>
                  ))}
                </Grid>
              </Box>
              <Box sx={{ textAlign: "end", paddingBottom: "22px" }}>
                {!viewid && (
                  <FilledButton
                    className="btnSubmit"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    <SVG.Vector /> {loading ? "Submitting..." : "Submit"}
                  </FilledButton>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </MainLayout>

      {/* Add Job Type Popup */}
      <Dialog open={jobTypePopup} onClose={handleJobTypePopupClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Job Type</DialogTitle>
        <DialogContent>
          <Box sx={{ paddingTop: "10px" }}>
            <label>Name</label>
            <TextInput
              type="text"
              placeholder="Enter job type name"
              value={newJobType.jobTypeName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewJobType({ jobTypeName: e.target.value })
              }
              autocomplete="off"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <FilledButton onClick={handleJobTypePopupClose}>Cancel</FilledButton>
          <FilledButton onClick={handleJobTypeSubmit}>Submit</FilledButton>
        </DialogActions>
      </Dialog>

      {/* Add City Popup */}
      <Dialog open={cityPopup} onClose={handleCityPopupClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add City</DialogTitle>
        <DialogContent>
          <Box sx={{ paddingTop: "10px" }}>
            <label>City</label>
            <TextInput
              type="text"
              placeholder="Enter city name"
              value={newCity.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewCity((prev) => ({ ...prev, name: e.target.value }))
              }
              autocomplete="off"
            />
          </Box>
          <Box sx={{ paddingTop: "20px" }}>
            <label>Address</label>
            <TextInput
              type="text"
              placeholder="Enter address"
              value={newCity.address}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewCity((prev) => ({ ...prev, address: e.target.value }))
              }
              autocomplete="off"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <FilledButton onClick={handleCityPopupClose}>Cancel</FilledButton>
          <FilledButton onClick={handleCitySubmit}>Submit</FilledButton>
        </DialogActions>
      </Dialog>

      {/* Add Industry Popup */}
      <Dialog open={industryPopup} onClose={handleIndustryPopupClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Industry</DialogTitle>
        <DialogContent>
          <Box sx={{ paddingTop: "10px" }}>
            <label>Name</label>
            <TextInput
              type="text"
              placeholder="Enter industry name"
              value={newIndustry.industryName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewIndustry({ industryName: e.target.value })
              }
              autocomplete="off"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <FilledButton onClick={handleIndustryPopupClose}>Cancel</FilledButton>
          <FilledButton onClick={handleIndustrySubmit}>Submit</FilledButton>
        </DialogActions>
      </Dialog>
    </AddJobStyled>
  );
}