// import TextInput from "@/components/labelInput";
"use client";
import MainLayout from "@/components/layout";
import { Box, CircularProgress, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import JobStyled from "../job-types/jobStyled";
import FilledButton from "@/components/button";
import { SVG } from "@/assets/svg";
import ColorStyled from "./colorStyled";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { JobApi } from "../api/jobs/JobApi";

export default function AppColor() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    headingOneColor: string;
    headingTwoColor: string;
    manageEmail: string;
    manageSavedJob: string;
  } | null>(null); // Initialize with null to avoid showing previous data

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // const { headingOneColor, headingTwoColor, manageEmail, manageSavedJob } =
      //   formData;
      if (!formData) return;

      const response = await JobApi.addAppColor(formData);
      if (response.remote === "success") {
        toast.success("Colors added successfully!");
        router.push("/manage-app-color");
      }
    } catch (error) {
      console.error("Error updating jobs:", error);
      toast.error("An error occurred while updating color.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetManageColor = async () => {
    try {
      setLoading(true);

      const response = await JobApi.getAllColor();
      if (response.remote === "success") {
        const data = response?.data?.data;

        setFormData({
          ...formData,
          headingOneColor: data?.headingOneColor ?? "",
          headingTwoColor: data?.headingTwoColor ?? "",
          manageEmail: data?.manageEmail ?? "",
          manageSavedJob: data?.manageSavedJob ?? "",
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
    handleGetManageColor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ColorStyled>
      {loading || !formData ? (
        <p>Loading...</p>
      ) : (
        <MainLayout>
          <Box className="dashboardContent">
            <Box sx={{ p: 4 }} className="appCOlor">
              <h5
                className="title"
                style={{ marginTop: "0", marginBottom: "16px" }}
              >
                Manage App Color
              </h5>
              <Box
                sx={{
                  padding: "20px",
                  background: "#fff",
                  borderRadius: "10px",
                }}
              >
                <Box sx={{ marginBottom: "16px" }}>
                  <label>Manage Heading One</label>
                  <TextField
                    fullWidth
                    type="color"
                    placeholder="Enter Heading"
                    autoComplete="off"
                    name="headingOneColor"
                    value={formData.headingOneColor}
                    onChange={handleChange}
                  />
                </Box>
                <Box sx={{ marginBottom: "16px" }}>
                  <label>Manage Heading Two</label>
                  <TextField
                    fullWidth
                    type="color"
                    placeholder="Enter Heading"
                    autoComplete="off"
                    name="headingTwoColor"
                    value={formData.headingTwoColor}
                    onChange={handleChange}
                  />
                </Box>
                <Box sx={{ marginBottom: "16px" }}>
                  <label>Manage Email</label>
                  <TextField
                    fullWidth
                    type="color"
                    placeholder="Enter Heading"
                    autoComplete="off"
                    name="manageEmail"
                    value={formData.manageEmail}
                    onChange={handleChange}
                  />
                </Box>
                <Box sx={{ marginBottom: "16px" }}>
                  <label>Manage Saved Job</label>
                  <TextField
                    fullWidth
                    type="color"
                    placeholder="Enter Heading"
                    autoComplete="off"
                    name="manageSavedJob"
                    value={formData.manageSavedJob}
                    onChange={handleChange}
                  />
                </Box>
                <Box sx={{ textAlign: "end", padding: "22px" }}>
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
      )}
    </ColorStyled>
  );
}
