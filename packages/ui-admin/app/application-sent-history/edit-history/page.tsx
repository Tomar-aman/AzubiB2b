"use client";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
// import { Delete, Download } from '@mui/icons-material'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SVG } from "@/assets/svg";
import TextInput from "@/components/labelInput";
import FilledButton from "@/components/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import EditHistoryStyled from "./editHistoryStyled";
import MainLayout from "@/components/layout";
import Image from "next/image";
import { ApplicationApi } from "@/app/api/applications/ApplicationApi";

// Define the type for the image preview
type ImagePreview = {
  name: string;
  url: string;
};
interface ApplicationData {
  jobId: string;
  name: string;
  email: string;
  phone: string;
  aboutMe: string;
  coverLetter: string;
  attachement: File[]; // Ensure attachement is an array of File objects
}
export default function EditHistory() {
  const router = useRouter();
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    jobId: "",
    name: "",
    email: "",
    phone: "",
    aboutMe: "",
    coverLetter: "",
    attachement: [],
  });

  const handleGetApplication = async (id: string) => {
    try {
      setLoading(true);
      const response = await ApplicationApi.getApplicationData(id);

      if (response.remote === "success") {
        const data = response.data.data;
        setApplicationData({
          ...applicationData,
          jobId: data.jobId?.jobTitle || "",
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          aboutMe: data.aboutMe || "",
          coverLetter: data.coverLetter || "",
          attachement: data.attachement || "",
        });
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApplicationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (id && typeof id === "string") {
      handleGetApplication(id);
    } else {
      console.error("Invalid application ID");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleGoBack = () => {
    router.back();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];

    setSelectedFiles((prev) => [...prev, ...files]);
    const updatedPreviews = files.map((file) => {
      return new Promise<ImagePreview>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({ name: file.name, url: reader.result as string });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(updatedPreviews).then((previews) => {
      setImagePreviews((prev) => [...prev, ...previews]);
    });
  };

  const handleDelete = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDownload = (image: ImagePreview) => {
    const link = document.createElement("a");
    link.href = image.url;
    link.download = image.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", applicationData.name);
      formData.append("email", applicationData.email);
      formData.append("phone", applicationData.phone);
      formData.append("aboutMe", applicationData.aboutMe);
      formData.append("coverLetter", applicationData.coverLetter);

      // Append selected files
      selectedFiles.forEach((file) => {
        formData.append("attachement", file);
      });

      if (id) {
        const response = await ApplicationApi.updateApplicationData(
          id as string,
          formData,
        );

        if (response.remote === "success") {
          toast.success("Application updated successfully!");
          router.push("/application-sent-history");
        }
      }
    } catch (error) {
      console.error("Error updating application:", error);
      toast.error("An error occurred while updating application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <EditHistoryStyled>
      <ToastContainer />
      <MainLayout>
        <Box sx={{ paddingLeft: "260px" }} className="addNew">
          <Box p={3}>
            <Box className="headerCompany">
              <SVG.Arrow onClick={handleGoBack} style={{ cursor: "pointer" }} />
              <h3>Edit</h3>
            </Box>
            <Box className="companyBox">
              <Box className="customLabel">
                <label>Job Title</label>
                <TextInput
                  name="jobId"
                  type="text"
                  placeholder="Enter job title"
                  value={applicationData.jobId}
                  onChange={handleChange}
                />
              </Box>
              <Box className="customLabel">
                <label>Name</label>
                <TextInput
                  name="name"
                  type="text"
                  placeholder="Enter name"
                  value={applicationData.name}
                  onChange={handleChange}
                />
              </Box>
              <Box className="customLabel">
                <label>Email</label>
                <TextInput
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={applicationData.email}
                  onChange={handleChange}
                />
              </Box>
              <Box className="customLabel">
                <label>Phone No.</label>
                <TextInput
                  name="phone"
                  type="number"
                  placeholder="Enter phone no."
                  value={applicationData.phone}
                  onChange={handleChange}
                />
              </Box>
              <Box className="customLabel">
                <label>Uber mich</label>
                <TextInput
                  name="aboutMe"
                  type="text"
                  placeholder="uber mich"
                  value={applicationData.aboutMe}
                  onChange={handleChange}
                />
              </Box>
              <Box className="customLabel">
                <label>Begleitschreiben</label>
                <TextInput
                  name="coverLetter"
                  type="text"
                  placeholder="Begleitschreiben"
                  value={applicationData.coverLetter}
                  onChange={handleChange}
                />
              </Box>
              <Box>
                <Box className="customLabel">
                  <label>Attachments</label>
                  <input
                    className="fileInput"
                    type="file"
                    accept="image/jpeg, image/webp"
                    multiple
                    onChange={handleFileChange}
                  />
                </Box>
                <Box
                  className="previewBox"
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                    marginTop: "16px",
                  }}
                >
                  {imagePreviews.map((image, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        width: "100px",
                        height: "100px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        "&:hover .overlay": {
                          opacity: 1,
                        },
                      }}
                    >
                      <Image
                        src={image.url}
                        alt="Uploaded preview"
                        layout="fill"
                        objectFit="contain"
                        unoptimized
                      />
                      <Box
                        className="overlay"
                        sx={{
                          padding: "10px",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "83%",
                          height: "100%",
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                          display: "flex",
                          alignItems: "start",
                          justifyContent: "space-between",
                          opacity: 0,
                          transition: "opacity 0.3s",
                        }}
                      >
                        <SVG.UploadDown
                          onClick={() => handleDownload(image)}
                          style={{ cursor: "pointer" }}
                        />
                        <SVG.UploadDelete
                          onClick={() => handleDelete(index)}
                          style={{ cursor: "pointer" }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box sx={{ textAlign: "end", paddingBottom: "22px" }}>
                <Link href="">
                  <FilledButton
                    className="btnSubmit"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    <SVG.Vector /> {loading ? "Submitting..." : "Submit"}
                  </FilledButton>
                </Link>
              </Box>
            </Box>
          </Box>
        </Box>
      </MainLayout>
    </EditHistoryStyled>
  );
}
