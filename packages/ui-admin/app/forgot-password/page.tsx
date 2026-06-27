"use client";

import React, { useState } from "react";
import Grid from "@mui/material/Grid2";
import { Box } from "@mui/material";
import { SVG } from "@/assets/svg";
import "react-toastify/dist/ReactToastify.css";
import LoginrStyled from "@/components/login/loginStyled";
import TextInput from "@/components/labelInput";
import FilledButton from "@/components/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthApi } from "../api/auth/AuthApi";
import { useSearchParams } from "next/navigation";
import logo1 from "../../assets/svg/logo1.jpg";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const company = searchParams.get("company");
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response: any = await AuthApi.forgotPassword(company, email);
      if (response.status === 200) {
        toast.success(
          "Password reset email sent successfully. Please contact the super admin",
        );
      } else {
      }
    } catch (error) {
      console.log(error);
      toast.error("Email sending error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginrStyled>
      <ToastContainer />
      <Box className="loginHead">
        <Grid
          container
          spacing={2}
          style={{
            width: "1200px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <Grid
            size={5}
            style={{
              alignItems: "end",
              display: "flex",
            }}
          >
            <Box>
              <SVG.Login />
            </Box>
          </Grid>
          <Grid size={1}></Grid>
          <Grid size={6}>
            <Box>
              <Box className="login">
                {/* <SVG.Logo /> */}
                <img src={logo1.src} alt="Company Job APP" style={{ width: '150px', height: 'auto' }} />
                <h1 style={{ marginBottom: "20px" }}>Forgot Password</h1>
              </Box>
              <label
                style={{
                  fontWeight: "500",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                Enter superadmin email
              </label>
              <TextInput
                className="loginField"
                type="text"
                placeholder="Enter email"
                value={email}
                onChange={handleChange}
              />
              <FilledButton className="loginBtn" onClick={handleSubmit}>
                {loading ? "Submitting..." : "Submit"}
              </FilledButton>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </LoginrStyled>
  );
}
