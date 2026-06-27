"use client";
import MainLayout from "@/components/layout";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import FilledButton from "@/components/button";
import { SVG } from "@/assets/svg";
import QuillEditor from "@/components/textarea";
import SidebarStyled from "../manage-sidebar/sidebarStyled";
import TextInput from "@/components/labelInput";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ContentApi } from "../api/content/ContentApi";

export default function ManageSidebar() {
  const [sideTips, setSidetips] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { name, description } = sideTips;

      const response = await ContentApi.addtipssidebarContent({
        name,
        description,
      });

      if (response.remote === "success") {
        toast.success("Tips added successfully!");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("An error occurred while updating company.");
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSidetips((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleGetContent = async () => {
    try {
      setLoading(true);
      const response = await ContentApi.gettipssidebarData();

      if (response.remote === "success") {
        const data = response.data.data;
        setSidetips({
          ...sideTips,
          name: data.name || "",
          description: data.description || "",
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
      <ToastContainer />
      <MainLayout>
        <Box sx={{ paddingLeft: "260px" }} className="addNew">
          <Box p={3}>
            <Box className="headerCompany">
              <h3>Manage Tips</h3>
            </Box>
            <Box className="companyBox">
              <Box className="imageText">
                <label
                  style={{
                    width: "181px",
                    marginRight: "20px",
                    alignItems: "center",
                  }}
                >
                  Name
                </label>
                <TextInput
                  type="text"
                  className="inputTips"
                  name="name"
                  onChange={handleChange}
                  value={sideTips.name}
                />
              </Box>
              <Box className="customLabel">
                <label>Description</label>
                <QuillEditor
                  onChange={(e: any) => {
                    setSidetips((prev: any) => ({
                      ...prev,
                      ["description"]: e,
                    }));
                  }}
                  value={sideTips.description}
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
