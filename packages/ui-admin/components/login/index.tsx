import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import { Box, Button, CircularProgress } from "@mui/material";
import { SVG } from "@/assets/svg";
import LoginrStyled from "./loginStyled";
import TextInput from "../labelInput";
import FilledButton from "../button";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthApi } from "@/app/api/auth/AuthApi";
import { useRouter, useSearchParams } from "next/navigation";
import logo1 from "../../assets/svg/logo1.jpg";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const company = searchParams.get("company");

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleCompany = async (company: string) => {
    setLoading(true);
    const response: any = await AuthApi.getCompanyByName(company);

    if (response?.remote === "success") {
      setEmail(response.data.data.email);
    } else {
      return response?.error;
    }
    setLoading(false);
  };

  useEffect(() => {
    if (company) {
      handleCompany(company);
    }
  }, [company]);

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
      const token = response.data.data.token;

      if (response.remote === "success") {
        localStorage.setItem("token", token);
        router.push("/admin-setting");
        toast.success("Login successful");
      } else {
        setErrors(response.error);
      }
    } catch (error) {
      toast.error("Email address or password is incorrect");
      setLoading(false);
    }
    setLoading(false);
  };

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
                  <img src={logo1.src} alt="Company Job APP" style={{ width: '150px', height: 'auto' }} />
                  <h1>{`Welcome ${company}!`}</h1>
                  <h3>Log In to your Account</h3>
                </Box>
                <TextInput
                  className="loginField"
                  type="text"
                  placeholder="Email"
                  value={email}
                // onChange={(e) => setEmail(e.target.value)}
                />
                <span style={{ color: "red", fontSize: "12px" }}>
                  {errors.email}
                </span>
                <TextInput
                  type="password"
                  className="loginField"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span style={{ color: "red", fontSize: "12px" }}>
                  {errors.password}
                </span>
                <Box sx={{ textAlign: "end", marginBottom: "22px" }}>
                  <Link
                    href={`/forgot-password?company=${company}`}
                    style={{ color: "#0096A4", fontWeight: "500" }}
                  >
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
