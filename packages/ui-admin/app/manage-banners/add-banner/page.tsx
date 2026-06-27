"use client";
import MainLayout from "@/components/layout";
import React, { useEffect, useState } from "react";
import { Box, TextField } from "@mui/material";
import { SVG } from "@/assets/svg";
import TextInput from "@/components/labelInput";
import FilledButton from "@/components/button";
import { useRouter, useSearchParams } from "next/navigation";
import AddBannerStyled from "./addbannerStyled";
import BasicSelect from "@/components/selectdropdown";
import UploadPicture from "@/components/uploadFIle";
import { JobApi } from "@/app/api/jobs/JobApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomRadioButton from "@/components/radioButton";
import { ManageCompanyApi } from "@/app/api/manageCompany/ManageCompanyApi";
import { useAppSelector } from "@monorepo/ui-core/src/redux/hooks";

export default function AddNewCompany() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { company } = useAppSelector((state) => state.globalCache);

  const [jobTypeList, setJobTypeList] = useState<any>([]);
  const [cityList, setCityList] = useState<any>([]);
  const [industriesList, setIndustriesList] = useState<any>([]);
  const [jobList, setJobList] = useState<any>([]);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [logoChangeable, setLogoChangeable] = useState(false);
  const [industriesChangeable, setIndustriesChangeable] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fields, setFields] = useState<{ id: number; text: string }[]>([]);
  const [manageCompanyData, setManageCompanyData] = useState<any>({
    companyId: "",
    jobListingPage: [],
    jobWall: [],
    sideMenu: [],
    manageJobAlarm: false,
    manageIndustries: false,
    manageCities: false,
    manageBanners: false,
  });
  const [bannerData, setBannerData] = useState<{
    jobType: string;
    city: string;
    industryName: string;
    bannerTitle: string;
    bannerImages: File | null;
    code: string;
    addLine: [];
    job: string;
    jobUrl: string;
  }>({
    jobType: "",
    city: "",
    industryName: "",
    bannerTitle: "",
    bannerImages: null,
    code: "",
    addLine: [],
    job: "",
    jobUrl: "",
  });

  const handleGoBack = () => {
    router.back();
  };

  // Handle adding a new field
  const handleAddField = () => {
    const newField = { id: fields.length + 1, file: null, text: "" };
    setFields([...fields, newField]); // Add the new field to the state
  };

  // Handle deleting a specific field
  const handleDeleteField = (id: number) => {
    const updatedFields = fields.filter((field) => field.id !== id); // Remove the field by id
    setFields(updatedFields);
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
  ) => {
    const updatedFields = fields.map((field) =>
      field.id === id ? { ...field, text: e.target.value } : field,
    );
    setFields(updatedFields);
  };

  const handleJobTypes = async () => {
    const response: any = await JobApi.getjobTypeData(company?._id);

    if (response?.remote === "success") {
      setJobTypeList(response.data.data.jobTypes);
    } else {
      return response?.error;
    }
  };
  const handleCityData = async () => {
    const response: any = await JobApi.getcityData(company?._id);

    if (response?.remote === "success") {
      setCityList(response.data.data.cities);
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
  const handleJobs = async () => {
    const response: any = await JobApi.getjobs();
    if (response?.remote === "success") {
      setJobList(response.data.data);
    } else {
      return response?.error;
    }
  };
  const items: any = [];
  jobTypeList?.map((item: any) => {
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
  const jobsitems: any = [];
  jobList?.map((item: any) => {
    jobsitems.push({
      value: item._id,
      label: item.jobTitle,
    });
  });

  const handleImageUpload = (file: File | null) => {
    setBannerData((prev) => ({
      ...prev,
      bannerImages: file,
    }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBannerData((prev) => ({
      ...prev,
      [name]: value,
      job: "",
    }));
  };
  useEffect(() => {
    handleJobTypes();
    handleIndustriesData();
    handleCityData();
    handleJobs();
  }, []);

  useEffect(() => {
    setBannerData((prev: any) => ({
      ...prev,
      ["addLine"]: fields,
    }));
  }, [fields]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const {
        jobType,
        city,
        industryName,
        bannerTitle,
        code,
        addLine,
        job,
        jobUrl,
      } = bannerData;

      const payload: any = {
        jobType,
        city: city?.trim() ? city : null,
        industryName: industryName?.trim() ? industryName : null,
        bannerTitle,
        bannerImages: bannerData.bannerImages,
        code,
        addLine: JSON.stringify(addLine),
        job: job?.trim() ? job : null,
        jobUrl: jobUrl?.trim() ? jobUrl : "",
      };

      if (job) {
        payload.job = job;
        payload.jobUrl = "";
      } else if (jobUrl) {
        payload.jobUrl = jobUrl;
        payload.job = null;
      }

      if (selectedValue === "three") {
        payload.job = null;
        payload.jobUrl = "";
      }

      if (!bannerTitle) {
        toast.error("Banner title is required.");
      }

      if (!city) {
        toast.error("City is required!");
      }

      if (!industryName) {
        toast.error("Industry is required!");
      }

      if (!jobType) {
        toast.error("Job-type is required!");
      }

      if (id) {
        const response = await JobApi.updateJobBannerData(
          id as any,
          payload as any,
        );

        if (response.remote === "success") {
          toast.success("Jobs added successfully!");
          router.push("/manage-banners");
        }
      } else {
        const response = await JobApi.addJobsBanner(payload);
        if (response.remote === "success") {
          toast.success("Jobs added successfully!");
          router.push("/manage-banners");
        }
      }
    } catch (error) {
      console.error("Error updating jobs:", error);
      toast.error("An error occurred while updating jobs.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetBannerData = async (id: string) => {
    try {
      setLoading(true);
      const response = await JobApi.getBannerData(id);

      if (response.remote === "success") {
        const data = response.data.data;
        if (data.addLine[0].text) {
          setFields(JSON.parse(data.addLine[0].text));
        }
        setBannerData({
          ...bannerData,
          jobType: data.jobType,
          city: data.city,
          industryName: data.industry,
          bannerTitle: data.bannerTitle,
          code: data.embeddedCode,
          bannerImages: data.images || null,
          job: data.job,
          jobUrl: data.jobUrl,
        });

        if (data.images) {
          setImagePreview(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${data.images}`,
          );
        }
      }
    } catch (error) {
      console.error("Error fetching banner data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      handleGetBannerData(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (bannerData.job) {
      setSelectedValue("one");
    } else if (bannerData.jobUrl) {
      setSelectedValue("two");
    } else {
      setSelectedValue("three");
    }
  }, [bannerData.job, bannerData.jobUrl]);

  const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  const handleGetManageCompany = async () => {
    try {
      setLoading(true);

      const response = await ManageCompanyApi.getManageCompanyData();
      if (response.remote === "success") {
        const data = response.data.data;
        setManageCompanyData({
          ...manageCompanyData,
          companyId: data.companyId ?? "",
          jobListingPage: Array.isArray(data.jobListingPage)
            ? data.jobListingPage
            : [],
          jobWall: Array.isArray(data.jobWall) ? data.jobWall : [],
          sideMenu: Array.isArray(data.sideMenu) ? data.sideMenu : [],
          manageJobAlarm: !!data.manageJobAlarm,
          manageIndustries: !!data.manageIndustries,
          manageCities: !!data.manageCities,
          manageBanners: !!data.manageBanners,
        });
      } else {
        throw new Error("Failed to load company data!");
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetManageCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const isLogoChangeable = manageCompanyData.jobWall.includes(
      "location text & location icon",
    );
    setLogoChangeable(isLogoChangeable);
    const isindustriesChangeable =
      manageCompanyData.jobWall.includes("Industries");
    setIndustriesChangeable(isindustriesChangeable);
  }, [manageCompanyData]);

  return (
    <AddBannerStyled>
      <ToastContainer />
      <MainLayout>
        <Box sx={{ paddingLeft: "260px" }} className="addNew">
          <Box p={3}>
            <Box className="headerCompany">
              <SVG.Arrow onClick={handleGoBack} style={{ cursor: "pointer" }} />
              <h3>Add banner</h3>
            </Box>
            <Box className="companyBox">
              {logoChangeable ? (
                <>
                  <Box className="selectLabel">
                    <label>City</label>
                    <BasicSelect
                      items={cityitems.filter(
                        (city: any) => city.status === true,
                      )}
                      className="my-select"
                      placeholder="Select"
                      value={bannerData.city}
                      multiple={false}
                      onValueChange={(e: any) => {
                        setBannerData((prev: any) => ({
                          ...prev,
                          ["city"]: e,
                        }));
                      }}
                    />
                  </Box>
                </>
              ) : (
                ""
              )}
              {industriesChangeable ? (
                <>
                  <Box className="selectLabel">
                    <label>Industry</label>
                    <BasicSelect
                      items={industriesitems}
                      className="my-select"
                      placeholder="Select"
                      value={bannerData.industryName}
                      multiple={false}
                      onValueChange={(e: any) => {
                        setBannerData((prev: any) => ({
                          ...prev,
                          ["industryName"]: e,
                        }));
                      }}
                    />
                  </Box>
                </>
              ) : (
                ""
              )}
              <Box className="selectLabel">
                <label>Types of jobs</label>
                <BasicSelect
                  items={items}
                  className="my-select"
                  placeholder="Select"
                  value={bannerData.jobType}
                  multiple={false}
                  onValueChange={(e: any) => {
                    setBannerData((prev: any) => ({
                      ...prev,
                      ["jobType"]: e,
                    }));
                  }}
                />
              </Box>
              <Box className="customLabel">
                <label>Banner title</label>
                <TextInput
                  type="text"
                  placeholder="Title"
                  name="bannerTitle"
                  value={bannerData.bannerTitle}
                  onChange={handleChange}
                />
              </Box>
              <Box className="jobLabel">
                <label>Job type</label>
                <Box sx={{ display: "flex" }}>
                  <Box sx={{ display: "flex" }}>
                    <CustomRadioButton
                      value="one"
                      label="Existing Job"
                      className="custom-class"
                      selectedValue={selectedValue}
                      onChange={handleChange1}
                    />
                    <CustomRadioButton
                      value="two"
                      label="External Url"
                      className="custom-class"
                      selectedValue={selectedValue}
                      onChange={handleChange1}
                    />
                    <CustomRadioButton
                      value="three"
                      label="None"
                      className="custom-class"
                      selectedValue={selectedValue}
                      onChange={handleChange1}
                    />
                  </Box>
                </Box>
              </Box>
              {selectedValue === "one" && (
                <Box className="selectLabel">
                  <label>Job</label>
                  <BasicSelect
                    items={jobsitems}
                    className="my-select"
                    placeholder="Select"
                    value={bannerData.job}
                    multiple={false}
                    onValueChange={(e: any) => {
                      setBannerData((prev: any) => ({
                        ...prev,
                        ["job"]: e,
                        jobUrl: "",
                      }));
                    }}
                  />
                </Box>
              )}

              {selectedValue === "two" && (
                <Box className="customLabel">
                  <label>Job Url</label>
                  <TextField
                    name="jobUrl"
                    type="text"
                    placeholder="Job Url"
                    variant="outlined"
                    fullWidth
                    value={bannerData.jobUrl}
                    onChange={handleChange}
                  />
                </Box>
              )}

              <Box className="additionalFIeld">
                <h5 onClick={handleAddField} style={{ cursor: "pointer" }}>
                  <SVG.Add /> ADD
                </h5>
                <Box sx={{ marginBottom: "20px" }}>
                  {fields.map((field) => (
                    <React.Fragment key={field.id}>
                      <Box className="customLabel">
                        <label>Add Line</label>
                        <TextInput
                          type="text"
                          placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed "
                          value={field.text}
                          onChange={(e: any) => handleTextChange(e, field.id)}
                        />
                        <Box
                          className="deleteText"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDeleteField(field.id)}
                        >
                          Remove
                        </Box>
                      </Box>
                    </React.Fragment>
                  ))}
                </Box>
              </Box>
              {logoChangeable ? (
                <>
                  <Box className="imageText">
                    <label style={{ width: "181px" }}>
                      <span> Preferred size 2480 x 3508 px</span>
                    </label>
                    <UploadPicture
                      value={imagePreview}
                      onChange={handleImageUpload}
                    />
                  </Box>
                </>
              ) : (
                ""
              )}
              <Box className="customLabel">
                <label>Embedded code</label>
                <TextInput
                  type="text"
                  placeholder="Code"
                  name="code"
                  value={bannerData.code}
                  onChange={handleChange}
                />
              </Box>
              <Box sx={{ textAlign: "end", paddingBottom: "22px" }}>
                {" "}
                <FilledButton
                  className="btnSubmit"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  <SVG.Vector /> Submit
                </FilledButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </MainLayout>
    </AddBannerStyled>
  );
}
