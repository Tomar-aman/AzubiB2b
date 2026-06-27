"use client";
import MainLayout from "@/components/layout";
import React, { useEffect, useState } from "react";
import LoginsStyled from "./settingStyled";
import { Box } from "@mui/material";
import { SVG } from "@/assets/svg";
import TextInput from "@/components/labelInput";
import FilledButton from "@/components/button";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { AuthApi } from "../api/auth/AuthApi";

export default function AdminSetting() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleDetails = async () => {
    setLoading(true);
    const response = await AuthApi.getSuperAdminData();

    if (response.remote === "success") {
      setFormData({
        ...formData,
        firstName: response.data.data.firstName,
        lastName: response.data.data.lastName,
        email: response.data.data.email,
      });
    } else {
      toast.error("Failed to load user data!");
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

  const handleSubmit = async () => {
    if (formData.newPassword && !formData.oldPassword) {
      toast.error("Old password is required when setting a new password");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New Password and Confirm Password do not match!");
      return;
    }

    if (!formData.firstName) {
      toast.error("First name is required!");
      return;
    }
     if (!formData.lastName) {
      toast.error("Last name is required!");
      return;
    }
     if (!formData.email) {
      toast.error("Email is required!");
      return;
    }

    setLoading(true);
    try {
      const { firstName, lastName, email, oldPassword, newPassword } = formData;

      const response = await AuthApi.updateData({
        firstName,
        lastName,
        email,
        oldPassword,
        newPassword,
      });

      if (response.remote === "success") {
        toast.success("Details updated successfully!");
      } else {
        toast.error("Incorrect old password")
      }
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("An error occurred while updating details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleDetails();
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
              <h3>{`Settings ${formData.firstName} ${formData.lastName}`}</h3>
            </Box>
            <Box className="companyBox">
              <h4>Manage Super Admin</h4>
              <Box className="customLabel">
                <label>First Name</label>
                <TextInput
                  name="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </Box>
              <Box className="customLabel">
                <label>Last Name</label>
                <TextInput
                  name="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Box>
              <Box className="customLabel">
                <label>Email</label>
                <TextInput
                  name="email"
                  type="text"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
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
                <Box sx={{ textAlign: "end", marginBottom: "2px", marginLeft: "8px" }}>
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
