import React, { useState } from "react";
import Grid from "@mui/material/Grid2";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { SVG } from "@/assets/svg";
import LoginrStyled from "./loginStyled";
import TextInput from "../labelInput";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthApi } from "@/pages/api/auth/AuthApi";
import { useRouter } from "next/router";
import Link from "next/link";
import logo1 from '../../assets/svg/logo1.jpg'

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: any) => {
    e.preventDefault();
    let newErrors: any = {};
    if (!email) {
      newErrors = {
        ...newErrors,
        email: "Email is required",
      };
    }

    if (!password) {
      newErrors = {
        ...newErrors,
        password: "Password is required",
      };
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length) {
      return;
    }

    try {
      setLoading(true);
      const response: any = await AuthApi.login({ email, password });

      if (response.remote === "success") {
        const accessToken = response.data.data.accessToken;
        const refreshToken = response.data.data.refreshToken;
        const userRole = response.data.data.user?.role;
        const userId = response.data.data.user?._id;
        const allowedRole = process.env.NEXT_PUBLIC_ACCESS;

        if (userRole !== allowedRole) {
          toast.error(`Access denied. Only ${allowedRole} can login.`);
          return;
        }

        localStorage.setItem("access-token", accessToken);
        localStorage.setItem("refresh-token", refreshToken);
        localStorage.setItem("userId", userId);
        localStorage.setItem("role", userRole);
        router.push("/dashboard");
        toast.success("Login successful");
      } else {
        setErrors(response.error);
        toast.error("Email address or password is incorrect");
      }
    } catch (error) {
      toast.error("Email address or password is incorrect");
    } finally {
      setLoading(false);
    }
  };

  const currentHost = typeof window !== "undefined" ? window.location.hostname : "";

  const superAdminHosts = [
    "azubi.super-admin.digimonk.net", // dev
    "superadmin.kundenzugang-companyjob.app", // live
  ];

  const showLogo = superAdminHosts.includes(currentHost)

  return (
    <LoginrStyled>
      <ToastContainer />
      <form onSubmit={handleLogin}>
        <Box className="loginHead">
          <Grid
            container
            spacing={2}
            style={{ width: "1200px", maxWidth: "1200px", margin: "0 auto" }}
          >
            <Grid size={5} style={{ alignItems: "end", display: "flex" }}>
              <Box>
                <SVG.Login />
              </Box>
            </Grid>
            <Grid size={1}></Grid>
            <Grid size={6}>
              <Box>
                <Box className="login">
                  {/* <SVG.Logo /> */}
                  {showLogo && (
                    <img src={logo1.src} alt="Company Job APP" style={{ width: '150px', height: 'auto' }} />
                  )}
                  <h1>Welcome Back!</h1>
                  <h3>Log In to your Account</h3>
                </Box>
                <TextInput
                  className="loginField"
                  placeholder="Enter your email"
                  type="text"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span style={{ color: "red", fontSize: "12px" }}>
                  {errors.email}
                </span>
                <TextInput
                  type="password"
                  className="loginField"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span style={{ color: "red", fontSize: "12px" }}>
                  {errors.password}
                </span>
                <Box sx={{ textAlign: "end", marginBottom: "16px" }}>
                  <Link href="/forgot-password" style={{ color: "#0096A4" }}>
                    Forgot Password ?
                  </Link>
                </Box>
                <Button className="loginBtn" type="submit">
                  {loading ? <CircularProgress /> : "Log in"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </form>
    </LoginrStyled>
  );
}
