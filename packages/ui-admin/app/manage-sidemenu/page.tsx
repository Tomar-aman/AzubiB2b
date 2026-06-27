"use client";
import MainLayout from "@/components/layout";
import React, { useEffect, useState } from "react";
import SidebarStyled from "./sidebarStyled";
import { Box } from "@mui/material";
import FilledButton from "@/components/button";
import { SVG } from "@/assets/svg";
import QuillEditor from "@/components/textarea";
import UploadPicture from "@/components/uploadFIle";
import { toast } from "react-toastify";
import { ContentApi } from "../api/content/ContentApi";

export default function ManageSidebar() {
  const [contentManange, setContentManage] = useState({
    logo: "",
    tips: "",
    alarm: "",
  });
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContentManage((prev: any) => ({
      ...prev,
      ["logo"]: event,
    }));
  };
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { logo, tips, alarm } = contentManange;

      const response = await ContentApi.addContent({
        logo,
        tips,
        alarm,
      });

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
      const response = await ContentApi.getContentData();

      if (response.remote === "success") {
        const data = response.data.data;
        setContentManage({
          ...contentManange,
          logo: data.logo || "",
          tips: data.tips || "",
          alarm: data.alarm || "",
        });
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
      <MainLayout>
        <Box sx={{ paddingLeft: "260px" }} className="addNew">
          <Box p={3}>
            <Box className="headerCompany">
              <h3>Content Management</h3>
            </Box>
            <Box className="companyBox">
              <h6 className="textMenu">Side Menu</h6>
              <Box className="imageText">
                <label style={{ width: "181px", alignItems: "center" }}>
                  Choose App logo
                </label>
                <UploadPicture
                  value={`${process.env.NEXT_PUBLIC_API_BASE_URL}${contentManange.logo}`}
                  onChange={(e: any) => handleImageUpload(e)}
                />
              </Box>
              <Box className="customLabel">
                <label>Bewerbung Tips manageable</label>
                <QuillEditor
                  onChange={(e: any) => {
                    setContentManage((prev) => ({
                      ...prev,
                      ["tips"]: e,
                    }));
                  }}
                  value={contentManange.tips}
                />
              </Box>
              <Box className="customLabel">
                <label>Job alarm</label>
                <QuillEditor
                  onChange={(e: any) => {
                    setContentManage((prev) => ({
                      ...prev,
                      ["alarm"]: e,
                    }));
                  }}
                  value={contentManange.alarm}
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
    </SidebarStyled>
  );
}
