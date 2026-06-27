"use client";
import MainLayout from "@/components/layout";
import React, { useEffect, useState } from "react";
import LoginsStyled from "./settingStyled";
import { Box } from "@mui/material";
import { SVG } from "@/assets/svg";
import TextInput from "@/components/labelInput";
import FilledButton from "@/components/button";
import { useRouter } from "next/navigation";
import { AdminApi } from "../api/user/AdminApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

export default function AdminSetting() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    profileIcon: any;
    companyname: string;
    email: string;
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>({
    profileIcon: null,
    companyname: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [companyname, setCompanyname] = useState("");
  const [imagePreview, setImagePreview] = useState<any>(null);

  const handleGetCompany = async () => {
    setLoading(true);
    const response = await AdminApi.getCompanyData();

    if (response.remote === "success") {
      setFormData({
        ...formData,
        profileIcon: response.data.data.profileIcon || null,
        companyname: response.data.data.companyname,
        email: response.data.data.email,
      });
      localStorage.setItem("companyId", response.data.data._id);
      if (response.data.data.profileIcon) {
        setImagePreview(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/${response.data.data.profileIcon}`,
        );
      }
      setCompanyname(response.data.data.companyname);
    } else {
      toast.error("Failed to load company data!");
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Store the actual FILE object (important!)
    setFormData((prev) => ({
      ...prev,
      profileIcon: file,
    }));

    // Preview the image in UI
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleSubmit = async () => {
    if (formData.newPassword && !formData.oldPassword) {
      toast.error("Old password is required when setting a new password");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New Password and Confirm Password do not match!");
      return;
    }

    setLoading(true);
    try {
      const { profileIcon, oldPassword, newPassword } = formData;

      const response = await AdminApi.updateCompanyData({
        profileIcon,
        oldPassword,
        newPassword,
      });

      if (response.remote === "success") {
        toast.success("Company updated successfully!");
      } else {
        toast.error("Incorrect old password");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("An error occurred while updating company.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoBack = () => {
    router.back(); // This will navigate to the previous page
  };
  return (
    <LoginsStyled>
      <ToastContainer />
      <MainLayout>
        <Box sx={{ paddingLeft: "260px" }} className="adNew">
          <Box p={3}>
            <Box className="headerCompany">
              <SVG.Arrow onClick={handleGoBack} style={{ cursor: "pointer" }} />
              <h3>{`Settings ${companyname}`}</h3>
            </Box>
            <Box className="companyBox">
              <h4>Manage Admin</h4>
              <Box
                className="customLabel"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <label>Profile Icon</label>
                  {formData.profileIcon && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #ddd",
                      }}
                    />
                  )}
                  <input
                    type="file"
                    accept="image/jpeg, image/webp"
                    onChange={handleFileChange}
                    style={{ marginTop: "6px" }}
                  />
                </Box>
              </Box>
              {/* <Box className="customLabel">
                <label>Admin Name</label>
                <TextInput
                  name="companyname"
                  type="text"
                  placeholder="Enter company name"
                  value={formData.companyname}
                  onChange={handleChange}
                />
              </Box> */}
              <Box className="customLabel">
                <label>Email</label>
                <TextInput
                  type="text"
                  placeholder="Enter company email"
                  value={formData.email}
                />
              </Box>
              <Box className="customLabel">
                <label>Old Password</label>
                <TextInput
                  name="oldPassword"
                  type="password"
                  placeholder="************"
                  value={formData.oldPassword}
                  onChange={handleChange}
                />{" "}
                <Box
                  sx={{
                    textAlign: "end",
                    marginBottom: "2px",
                    marginLeft: "8px",
                  }}
                >
                  <Link
                    href="/forgot-password"
                    style={{
                      color: "#0096A4",
                      fontWeight: "500",
                      fontSize: "14px",
                      whiteSpace: "nowrap",
                      textDecoration: "none",
                    }}
                  >
                    Forgot Password ?
                  </Link>
                </Box>
              </Box>
              <Box className="customLabel">
                <label>New Password</label>
                <TextInput
                  name="newPassword"
                  type="password"
                  placeholder="************"
                  value={formData.newPassword}
                  onChange={handleChange}
                />{" "}
              </Box>
              <Box className="customLabel">
                <label>Confirm Password</label>
                <TextInput
                  type="password"
                  name="confirmPassword"
                  placeholder="************"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />{" "}
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
    </LoginsStyled>
  );
}
