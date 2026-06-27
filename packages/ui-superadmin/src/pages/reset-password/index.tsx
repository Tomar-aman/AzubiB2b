"use client";

import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import { Box } from "@mui/material";
import { SVG } from "@/assets/svg";
import "react-toastify/dist/ReactToastify.css";
import LoginrStyled from "@/components/login/loginStyled";
import TextInput from "@/components/labelInput";
import FilledButton from "@/components/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { AuthApi } from "../api/auth/AuthApi";
import logo1 from "../../assets/svg/logo1.jpg";

export default function ResetPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [errors, setErrors] = useState({
    confirmPassword: "",
    password: "",
  });

  const handlePasswordReset = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (confirmPassword !== password) {
        toast.error("Password must match");
        return;
      }

      if (password.length < 6) {
        toast.error("Password must be 6 character");
        return;
      }
      const response: any = await AuthApi.resetPassword(password, token);

      if (response.remote === "success") {
        const accessToken = response.data.data.accessToken;
        const refreshToken = response.data.data.refreshToken;
        localStorage.setItem("access-token", accessToken);
        localStorage.setItem("refresh-token", refreshToken);
        router.push("/dashboard");

        toast.success("Login successful");
      } else {
        setErrors(response.error);
      }
    } catch (error) {
      toast.error("Email address or password is incorrect");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const token = urlSearchParams.get("token");

    if (token) {
      setToken(token);
    } else {
      console.error("Token not found in the URL");
    }
  }, []);

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
                <h1 style={{ marginBottom: "20px" }}>Reset Password</h1>
              </Box>
              <label
                style={{
                  fontWeight: "500",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                Password
              </label>
              <TextInput
                type="password"
                className="loginField"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <label
                style={{
                  fontWeight: "500",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                Confirm Password
              </label>
              <TextInput
                type="password"
                className="loginField"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <FilledButton className="loginBtn" onClick={handlePasswordReset}>
                {loading ? "Submitting..." : "Submit"}
              </FilledButton>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </LoginrStyled>
  );
}
