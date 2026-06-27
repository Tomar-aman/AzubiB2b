"use client";
import MainLayout from "@/components/layout";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import FilledButton from "@/components/button";
import { SVG } from "@/assets/svg";
import QuillEditor from "@/components/textarea";
import UploadPicture from "@/components/uploadFIle";
import WallStyled from "./wallStyled";
import { ContentApi } from "../api/content/ContentApi";
import { toast } from "react-toastify";

export default function ManageSidebar() {
  const [contentManage, setContentManage] = useState<{
    logo: File | null;
    headingOne: string;
    headingTwo: string;
  }>({
    logo: null,
    headingOne: "",
    headingTwo: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!contentManage.logo) {
        toast.error("Please upload a logo before submitting.");
        return;
      }

      const formData = new FormData();
      formData.append("logo", contentManage.logo);
      formData.append("headingOne", contentManage.headingOne);
      formData.append("headingTwo", contentManage.headingTwo);

      const response = await ContentApi.addWallContent(formData);
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
      const response = await ContentApi.getWallContentData();

      if (response.remote === "success") {
        const data = response.data.data;

        setContentManage({
          logo: data.logo || null,
          headingOne: data.headingOne || "",
          headingTwo: data.headingTwo || "",
        });

        setImagePreview(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}${data.logo || ""}`,
        );
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    handleGetContent();
  }, []);
  return (
    <WallStyled>
      <MainLayout>
        <Box sx={{ paddingLeft: "260px" }} className="addNew">
          <Box p={3}>
            <Box className="headerCompany">
              <h3>Job Wall</h3>
            </Box>
            <Box className="companyBox">
              <h6 className="textMenu">Side Menu</h6>
              <Box className="imageText">
                <label style={{ width: "181px", alignItems: "center" }}>
                  Choose App logo
                </label>
                <UploadPicture
                  value={imagePreview}
                  onChange={handleImageUpload}
                />
              </Box>
              <Box className="customLabel">
                <label>Heading one</label>
                <QuillEditor
                  onChange={(e: any) => {
                    setContentManage((prev) => ({
                      ...prev,
                      ["headingOne"]: e,
                    }));
                  }}
                  value={contentManage.headingOne}
                />
              </Box>
              <Box className="customLabel">
                <label>Heading two</label>
                <QuillEditor
                  onChange={(e: any) => {
                    setContentManage((prev) => ({
                      ...prev,
                      ["headingTwo"]: e,
                    }));
                  }}
                  value={contentManage.headingTwo}
                />
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
    </WallStyled>
  );
}
