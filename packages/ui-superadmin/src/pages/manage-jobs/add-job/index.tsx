import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddJobStyled from "./addJobStyled";
import MainLayout from "@/components/layout";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useRouter } from "next/router";
import { SVG } from "@/assets/svg";
import BasicSelect from "@/components/selectdropdown";
import { useEffect, useState } from "react";
import TextInput from "@/components/labelInput";
import QuillEditor from "@/components/textarea";
import FilledButton from "@/components/button";
import MultipleUploadPicture from "@/components/multipleUploadfile";
import { useFormik } from "formik";
import { CompanyApi } from "@/pages/api/company/CompanyApi";
import React from "react";
import Grid from "@mui/material/Grid2";
import { JobApi } from "@/pages/api/jobs/jobApi";
import { useSearchParams } from "next/navigation";

const Required = () => <span style={{ color: "red" }}> *</span>;

export default function AddJob() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [companyList, setCompanyList] = useState<any>([]);
  const [jobList, setJobList] = useState<any>([]);
  const [cityList, setCityList] = useState<any>([]);
  const [industriesList, setIndustriesList] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [iconList, setIconList] = useState<any>([]);
  const [fields, setFields] = useState<
    { id: number; file: string; text: string }[]
  >([]);
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  // Job Images state
  const [existingJobImages, setExistingJobImages] = useState<any[]>([]);
  const [newJobImagesToUpload, setNewJobImagesToUpload] = useState<File[]>([]);
  const [newJobImagePreviews, setNewJobImagePreviews] = useState<string[]>([]);

  // Attachments state
  const [existingAttachments, setExistingAttachments] = useState<any[]>([]);
  const [newAttachmentsToUpload, setNewAttachmentsToUpload] = useState<File[]>(
    [],
  );
  const [newAttachmentPreviews, setNewAttachmentPreviews] = useState<string[]>(
    [],
  );

  // Popup states
  const [jobTypePopup, setJobTypePopup] = useState(false);
  const [cityPopup, setCityPopup] = useState(false);
  const [industryPopup, setIndustryPopup] = useState(false);

  // Popup form data
  const [newJobType, setNewJobType] = useState({ jobTypeName: "" });
  const [newCity, setNewCity] = useState({ name: "", address: "" });
  const [newIndustry, setNewIndustry] = useState({ industryName: "" });

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId") || "";
    formik.setFieldValue("userId", storedUserId);
  }, []);

  // Formik
  const formik = useFormik({
    initialValues: {
      userId: "",
      company: "",
      jobType: "",
      city: [] as string[],
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
    },
    onSubmit: async (values) => {
      try {
        setLoading(true);
        if (!values.city || values.city.length === 0) {
          toast.error("City is required.");
          setLoading(false);
          return;
        }
        if (!values.industryName) {
          toast.error("Industry name is required.");
          setLoading(false);
          return;
        }
        if (!values.jobTitle) {
          toast.error("Job title is required.");
          setLoading(false);
          return;
        }
        if (!values.phoneNumber) {
          toast.error("Phone number is required.");
          setLoading(false);
          return;
        }
        // if (!values.email) {
        //   toast.error("Email is required.");
        //   setLoading(false);
        //   return;
        // }
        if (!values.address) {
          toast.error("Address is required.");
          setLoading(false);
          return;
        }
        if (!values.locationField) {
          toast.error("Location field is required.");
          setLoading(false);
          return;
        }
        if (!values.jobDescription) {
          toast.error("Job description is required.");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        if (!id) {
          formData.append("userId", values.userId);
          formData.append("companyId", values.company);
          formData.append("email", values.email);
        }
        formData.append("jobType", values.jobType);
        formData.append("city", JSON.stringify(values.city));
        formData.append("industryName", values.industryName);
        formData.append("jobTitle", values.jobTitle);
        formData.append("phoneNumber", values.phoneNumber);
        formData.append("additionalEmail", values.additionalEmail);
        formData.append("address", values.address);
        formData.append("mapUrl", values.mapUrl);
        formData.append("locationField", values.locationField);
        formData.append("locationUrl", values.locationUrl);
        formData.append("jobDescription", values.jobDescription);
        formData.append("videoLink", values.videoLink);
        formData.append("embeddedCode", values.embeddedCode);
        formData.append("additionalData", JSON.stringify(fields));

        formData.append(
          "existingAttachments",
          JSON.stringify(existingAttachments),
        );
        if (newAttachmentsToUpload.length > 0) {
          newAttachmentsToUpload.forEach((file: File) => {
            formData.append("attachement[]", file);
          });
        }

        formData.append("existingJobImages", JSON.stringify(existingJobImages));
        if (newJobImagesToUpload.length > 0) {
          newJobImagesToUpload.forEach((file: File) => {
            formData.append("jobImages[]", file);
          });
        }

        if (id) {
          const response = await JobApi.updateJob(id as any, formData as any);
          if (response.remote === "success") {
            toast.success("Job updated successfully!");
            // router.push("/manage-jobs");
            handleGoBack()
          }
        } else {
          const response = await JobApi.addJobs(formData);
          if (response.remote === "success") {
            toast.success("Job added successfully!");
            // router.push("/manage-jobs");
            handleGoBack()
          }
        }
      } catch (error) {
        console.error("Error adding job:", error);
        toast.error("An error occurred while adding job.");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleGetJob = async (id: string) => {
    try {
      setLoading(true);

      const response = await JobApi.getJobById(id);
      if (response.remote === "success") {
        const data = response.data.data;
        console.log({ data })
        formik.setFieldValue("company", data.company);
        formik.setFieldValue("jobType", data.jobType);
        formik.setFieldValue("city", data.cities);
        formik.setFieldValue("industryName", data.industry);
        formik.setFieldValue("jobTitle", data.jobTitle);
        formik.setFieldValue("phoneNumber", data.phoneNumber);
        formik.setFieldValue("email", data.email);
        formik.setFieldValue("additionalEmail", data.additionalEmail);
        formik.setFieldValue("address", data.address);
        formik.setFieldValue("mapUrl", data.mapUrl);
        formik.setFieldValue("locationField", data.locationField);
        formik.setFieldValue("locationUrl", data.locationUrl);
        formik.setFieldValue("jobDescription", data.jobDescription);
        formik.setFieldValue("videoLink", data.videoLink);
        formik.setFieldValue("embeddedCode", data.embeddedCode);

        setFields(data.additionalData || []);
        setExistingAttachments(
          Array.isArray(data.attachement) && data.attachement.length > 0
            ? data.attachement
            : [],
        );
        setExistingJobImages(
          Array.isArray(data.jobImages) && data.jobImages.length > 0
            ? data.jobImages
            : [],
        );
      }
    } catch (error) {
      console.error("Error fetching job data:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log("Formik values: ", formik.values)
  useEffect(() => {
    if (id) {
      handleGetJob(id);
    }
  }, [id]);

  // File handlers
  const handleFileJobChange = (
    files: File[] | null,
    existingImages: string[],
  ) => {
    if (files && files.length > 0) {
      setNewJobImagesToUpload(files);
      const previews: string[] = [];
      let loaded = 0;
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result as string);
          loaded++;
          if (loaded === files.length) setNewJobImagePreviews(previews);
        };
        reader.readAsDataURL(file);
      });
    } else {
      setNewJobImagesToUpload([]);
      setNewJobImagePreviews([]);
    }
  };

  const handleFileAttachmentChange = (
    files: File[] | null,
    existingImages: string[],
  ) => {
    if (files && files.length > 0) {
      setNewAttachmentsToUpload(files);
      const previews: string[] = [];
      let loaded = 0;
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result as string);
          loaded++;
          if (loaded === files.length) setNewAttachmentPreviews(previews);
        };
        reader.readAsDataURL(file);
      });
    } else {
      setNewAttachmentsToUpload([]);
      setNewAttachmentPreviews([]);
    }
  };

  // Additional fields handlers
  const handleAddField = () => {
    setFields([...fields, { id: fields.length + 1, file: "", text: "" }]);
  };

  const handleDeleteField = (id: number) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
  ) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, text: e.target.value } : field,
      ),
    );
  };

  // Data fetchers
  const handleCompanies = async () => {
    const storedUserId = localStorage.getItem("userId") || "";

    const payload =
      storedUserId !== formik.values.userId
        ? {}
        : { userId: formik.values.userId };

    const response: any = await CompanyApi.getAllCompanies(payload);
    if (response?.remote === "success") {
      setCompanyList(response.data.data.companies);
    }
  };

  const handleJobTypes = async () => {
    const response: any = await JobApi.getjobTypeData(formik.values.company);
    if (response?.remote === "success") {
      setJobList(response.data.data.jobTypes);
    }
  };

  const handleCityData = async () => {
    const response: any = await CompanyApi.getAllCities(formik.values.company);
    if (response?.remote === "success") {
      setCityList(response.data.data.cities);
    }
  };

  const handleIndustriesData = async () => {
    const response: any = await JobApi.getindustryData(formik.values.company);
    if (response?.remote === "success") {
      setIndustriesList(response.data.data.industries);
    }
  };

  const handleGetIcons = async () => {
    const response: any = await JobApi.getIcons();
    if (response?.remote === "success") {
      setIconList(
        response.data.data.map((item: any) => ({
          value: item.icon,
          label: item.icon,
          preview: `${baseURL}/${item.icon}`,
        })),
      );
    }
  };

  useEffect(() => {
    if (formik.values.userId) {
      handleCompanies();
    }
    handleGetIcons();
  }, [formik.values.userId]);

  useEffect(() => {
    if (formik.values.company) {
      handleJobTypes();
      handleCityData();
      handleIndustriesData();
      const selectedCompany = companyList.find(
        (item: any) => item._id === formik.values.company,
      );

      // if (selectedCompany?.email) {
      formik.setFieldValue("email", selectedCompany?.email);
      // } else {
      //   formik.setFieldValue("email", "");
      // }
    }
  }, [formik.values.company]);

  // Dropdown items
  const companyItems = companyList.map((item: any) => ({
    value: item._id,
    label: item.companyname,
    email: item.email,
  }));
  const jobTypeItems = jobList.map((item: any) => ({
    value: item._id,
    label: item.jobTypeName,
  }));
  const cityItems = cityList.map((item: any) => ({
    value: item._id,
    label: item.name,
    status: item.status,
  }));
  const industriesItems = industriesList.map((item: any) => ({
    value: item._id,
    label: item.industryName,
  }));

  // Preview URLs
  const jobImagePreviewUrls = [
    ...existingJobImages.map((img: any) => `${baseURL}${img.file}`),
    ...newJobImagePreviews,
  ];
  const attachmentPreviewUrls = [
    ...existingAttachments.map((img: any) => `${baseURL}${img.file}`),
    ...newAttachmentPreviews,
  ];

  const handleGoBack = () => router.back();

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

  // Popup submit handlers
  const handleJobTypeSubmit = async () => {
    try {
      setLoading(true);
      if (!newJobType.jobTypeName) {
        toast.error("JobType name is required.");
        return;
      }
      const response = await JobApi.addJobType({
        companyId: formik.values.company,
        jobTypeName: newJobType.jobTypeName,
      });
      if (response.remote === "success")
        toast.success("Job type added successfully!");
    } catch (error) {
      toast.error("An error occurred while adding job type.");
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
      const payload: any = { name, address, companyId: formik.values.company };
      const response = await CompanyApi.addCity(payload);
      if (response.remote === "success")
        toast.success("City added successfully!");
    } catch (error) {
      toast.error("An error occurred while adding city.");
    } finally {
      setLoading(false);
      handleCityPopupClose();
      handleCityData();
    }
  };

  const handleIndustrySubmit = async () => {
    try {
      setLoading(true);
      if (!newIndustry.industryName) {
        toast.error("Industry name is required.");
        return;
      }
      const response = await JobApi.addIndustry({
        companyId: formik.values.company,
        industryName: newIndustry.industryName,
      });
      if (response.remote === "success")
        toast.success("Industry added successfully!");
    } catch (error) {
      toast.error("An error occurred while adding industry.");
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
              {!id && (
                <Box className="selectLabel">
                  <label>Company</label>
                  <BasicSelect
                    items={companyItems}
                    className="my-select"
                    multiple={false}
                    disabled={!!id}
                    value={formik.values.company}
                    onValueChange={(e: any) => formik.setFieldValue("company", e)}
                  />
                </Box>
              )}
              <Box className="selectLabel">
                <label>Type of job
                  <Required />
                </label>
                <BasicSelect
                  items={jobTypeItems}
                  className="my-select"
                  multiple={false}
                  value={formik.values.jobType}
                  onValueChange={(e: any) => formik.setFieldValue("jobType", e)}
                />
                <Button
                  onClick={handleJobTypePopupOpen}
                  style={{ minWidth: "150px" }}
                  className="addTextBtn"
                >
                  Add Job Type
                </Button>
              </Box>
              <Box className="selectLabel">
                <label>
                  City
                  <Required />
                </label>
                <BasicSelect
                  items={cityItems.filter((city: any) => city.status === true)}
                  className="my-select"
                  placeholder="Select City"
                  multiple={true}
                  value={formik.values.city}
                  onValueChange={(e: any) => formik.setFieldValue("city", e)}
                />
                <Button
                  onClick={handleCityPopupOpen}
                  style={{ minWidth: "150px" }}
                >
                  Add City
                </Button>
              </Box>
              <Box className="selectLabel">
                <label>
                  Industries
                  <Required />
                </label>
                <BasicSelect
                  items={industriesItems}
                  className="my-select"
                  multiple={false}
                  value={formik.values.industryName}
                  onValueChange={(e: any) =>
                    formik.setFieldValue("industryName", e)
                  }
                />
                <Button
                  onClick={handleIndustryPopupOpen}
                  style={{ minWidth: "150px" }}
                >
                  Add Industry
                </Button>
              </Box>
              <Box className="customLabel">
                <label>
                  Job Title
                  <Required />
                </label>
                <TextInput
                  name="jobTitle"
                  type="text"
                  placeholder="Enter job title"
                  value={formik.values.jobTitle}
                  onChange={formik.handleChange}
                />
              </Box>
              <Box className="customLabel">
                <label>
                  Phone number
                  <Required />
                </label>
                <TextInput
                  name="phoneNumber"
                  type="text"
                  placeholder="Enter phone no."
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                />
              </Box>
              <Box className="customLabel">
                <label>
                  Email Id
                  <Required />
                </label>
                <TextInput
                  name="email"
                  type="text"
                  placeholder="Enter your email"
                  value={formik.values.email}
                />
              </Box>
              <Box className="customLabel">
                <label>Additional Email</label>
                <TextInput
                  name="additionalEmail"
                  type="text"
                  placeholder="Enter additional email"
                  value={formik.values.additionalEmail}
                  onChange={formik.handleChange}
                />
              </Box>
              <Box className="customLabel">
                <label>
                  Address
                  <Required />
                </label>
                <TextInput
                  name="address"
                  type="text"
                  placeholder="Enter address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                />
              </Box>
              <Box className="customLabel">
                <label>Google Map Url</label>
                <TextInput
                  name="mapUrl"
                  type="text"
                  placeholder="Enter url"
                  value={formik.values.mapUrl}
                  onChange={formik.handleChange}
                />
              </Box>
              <Box className="customLabel">
                <label>
                  Location
                  <Required />
                </label>
                <TextInput
                  name="locationField"
                  type="text"
                  placeholder="Enter a Location"
                  value={formik.values.locationField}
                  onChange={formik.handleChange}
                />
              </Box>
              <Box className="customLabel">
                <label>Location Url</label>
                <TextInput
                  name="locationUrl"
                  type="text"
                  placeholder="Enter a Location Url"
                  value={formik.values.locationUrl}
                  onChange={formik.handleChange}
                />
              </Box>
              <Box className="customLabel">
                <label>
                  Job Description
                  <Required />
                </label>
                <QuillEditor
                  value={formik.values.jobDescription}
                  onChange={(e: any) =>
                    formik.setFieldValue("jobDescription", e)
                  }
                />
              </Box>
              {/* <Box className="customLabel">
                <Box
                  className="imageText"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <label>Attachments</label>
                  <MultipleUploadPicture
                    type="attachement"
                    value={attachmentPreviewUrls}
                    onChange={handleFileAttachmentChange}
                    existingServerImages={existingAttachments}
                    onExistingImagesChange={setExistingAttachments}
                  />
                </Box>
              </Box> */}
              <Box className="customLabel">
                <Box
                  className="imageText"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <label>Job Images</label>
                  <MultipleUploadPicture
                    type="image"
                    value={jobImagePreviewUrls}
                    onChange={handleFileJobChange}
                    existingServerImages={existingJobImages}
                    onExistingImagesChange={setExistingJobImages}
                  />
                </Box>
              </Box>
              <Box className="customLabel">
                <label>Embedded Code</label>
                <TextInput
                  name="embeddedCode"
                  type="text"
                  placeholder="Embedded Code"
                  value={formik.values.embeddedCode}
                  onChange={formik.handleChange}
                />
              </Box>
              <Box className="additionalFIeld">
                <h5 onClick={handleAddField} style={{ cursor: "pointer" }}>
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
                            onValueChange={(e: any) =>
                              setFields((prev) =>
                                prev.map((f) =>
                                  f.id === field.id ? { ...f, file: e } : f,
                                ),
                              )
                            }
                          />
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
                <FilledButton
                  className="btnSubmit"
                  onClick={() => formik.handleSubmit()}
                  disabled={loading}
                >
                  <SVG.Vector /> {loading ? "Submitting..." : "Submit"}
                </FilledButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </MainLayout>

      {/* Add Job Type Popup */}
      <Dialog
        open={jobTypePopup}
        onClose={handleJobTypePopupClose}
        maxWidth="sm"
        fullWidth
      >
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
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <FilledButton onClick={handleJobTypePopupClose}>Cancel</FilledButton>
          <FilledButton onClick={handleJobTypeSubmit}>Submit</FilledButton>
        </DialogActions>
      </Dialog>

      {/* Add City Popup */}
      <Dialog
        open={cityPopup}
        onClose={handleCityPopupClose}
        maxWidth="sm"
        fullWidth
      >
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
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <FilledButton onClick={handleCityPopupClose}>Cancel</FilledButton>
          <FilledButton onClick={handleCitySubmit}>Submit</FilledButton>
        </DialogActions>
      </Dialog>

      {/* Add Industry Popup */}
      <Dialog
        open={industryPopup}
        onClose={handleIndustryPopupClose}
        maxWidth="sm"
        fullWidth
      >
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