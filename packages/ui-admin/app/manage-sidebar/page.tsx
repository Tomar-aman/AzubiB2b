"use client";
import MainLayout from "@/components/layout";
import React, { useEffect, useState } from "react";
import SidebarStyled from "./sidebarStyled";
import { Box } from "@mui/material";
import FilledButton from "@/components/button";
import { SVG } from "@/assets/svg";
import UploadPicture from "@/components/uploadFIle";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ContentApi } from "../api/content/ContentApi";

export default function ManageSidebar() {
  const [loading, setLoading] = useState(false);
  const [sidebarLogo, setSidebarLogo] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (file: File | null) => {
    setSidebarLogo(file);
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
      if (!sidebarLogo) {
        toast.error("Please upload a logo before submitting.");
        return;
      }

      const formData = new FormData();
      formData.append("logo", sidebarLogo);

      const response = await ContentApi.addsidebarContent(formData);
      if (response.remote === "success") {
        toast.success("Logo added successfully!");
      }
    } catch (error) {
      console.error("Error updating logo:", error);
      toast.error("An error occurred while updating the logo.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetContent = async () => {
    try {
      setLoading(true);
      const response = await ContentApi.getsidebarData();
      if (response.remote === "success") {
        const data = response.data.data;
        setImagePreview(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/${data.logo || ""}`,
        );
      }
    } catch (error) {
      console.error("Error fetching sidebar data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetContent();
  }, []);

  return (
    <SidebarStyled>
      <ToastContainer />
      <MainLayout>
        <Box sx={{ paddingLeft: "260px" }} className="addNew">
          <Box p={3}>
            <Box className="headerCompany">
              <h3>Manage Sidebar</h3>
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
