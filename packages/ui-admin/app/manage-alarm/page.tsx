"use client";
import MainLayout from "@/components/layout";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import FilledButton from "@/components/button";
import { SVG } from "@/assets/svg";
import UploadPicture from "@/components/uploadFIle";
import TextInput from "@/components/labelInput";
import SidebarStyled from "../manage-sidebar/sidebarStyled";
import { ContentApi } from "../api/content/ContentApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManageSidebar() {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [contentManage, setContentManage] = useState<{
    logo: File | null;
    lineOne: string;
    lineTwo: string;
  }>({
    logo: null,
    lineOne: "",
    lineTwo: "",
  });

  const handleImageUpload = (file: File | null) => {
    setContentManage((prev) => ({
      ...prev,
      logo: file,
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
    setContentManage((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!contentManage.logo) {
        toast.error("Please upload a logo before submitting.");
        return;
      }

      const formData: any = new FormData();
      formData.append("logo", contentManage.logo);
      formData.append("lineOne", contentManage.lineOne);
      formData.append("lineTwo", contentManage.lineTwo);

      const response = await ContentApi.addalarmContent(formData as any);
      if (response.remote === "success") {
        toast.success("Company added successfully!");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("An error occurred while updating company.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetContent = async () => {
    try {
      setLoading(true);
      const response = await ContentApi.getalarmData();

      if (response.remote === "success") {
        const data = response.data.data;
        setContentManage({
          logo: data.logo || null,
          lineOne: data.lineOne || "",
          lineTwo: data.lineTwo || "",
        });

        setImagePreview(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${data.logo}`);
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    handleGetContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <SidebarStyled>
      <ToastContainer />
      <MainLayout>
        <Box sx={{ paddingLeft: "260px" }} className="addNew">
          <Box p={3}>
            <Box className="headerCompany">
              <h3>Manage Alarm</h3>
            </Box>
            <Box className="companyBox">
              {/* <h6 className="textMenu">Side Menu</h6> */}
              <Box className="imageText" sx={{ marginBottom: "20px" }}>
                <label style={{ width: "181px", alignItems: "center" }}>
                  Choose App logo
                </label>
                <UploadPicture
                  value={imagePreview}
                  onChange={handleImageUpload}
                />
              </Box>
              <Box className="imageText">
                <label
                  style={{
                    width: "181px",

                    minWidth: "162px",
                    marginRight: "20px",
                    alignItems: "center",
                  }}
                >
                  Manage Line 1
                </label>
                <TextInput
                  type="text"
                  className="inputTips"
                  name="lineOne"
                  value={contentManage.lineOne}
                  onChange={handleChange}
                />
              </Box>
              <Box className="customLabel" sx={{ marginLeft: "0 !important" }}>
                <label
                  style={{
                    width: "182px",
                    minWidth: "182px",
                  }}
                >
                  Manage Line 2
                </label>
                {/* <QuillEditor /> */}
                <TextInput
                  type="text"
                  className="inputTips"
                  name="lineTwo"
                  value={contentManage.lineTwo}
                  onChange={handleChange}
                />
              </Box>

              <Box sx={{ textAlign: "end", paddingBottom: "22px" }}>
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
    </SidebarStyled>
  );
}
