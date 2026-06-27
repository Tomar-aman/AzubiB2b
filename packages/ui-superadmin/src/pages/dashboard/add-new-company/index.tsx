import MainLayout from "@/components/layout";
import React, { useState } from "react";
import StylesStyled from "./stylesStyled";
import { Box, Button } from "@mui/material";
import { SVG } from "@/assets/svg";
import TextInput from "@/components/labelInput";
import { useRouter } from "next/router";
import { CompanyApi } from "@/pages/api/company/CompanyApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddNewCompany() {
  const router = useRouter();
  const userRole = process.env.NEXT_PUBLIC_ACCESS;

  const [loading, setLoading] = useState(false);
  const [companyname, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [smtpHost, setSmtpHost] = useState("");
  // const [smtpPort, setSmtpPort] = useState<string | undefined>(undefined);
  // const [smtpUserName, setSmtpUserName] = useState("");
  // const [smtpPassword, setSmtpPassword] = useState("");
  // const [smtpEncryption, setSmtpEncryption] = useState("");
  // const [smtpAddress, setSmtpAddresss] = useState("");
  const [companyId, setCompanyId] = useState(null);
  const [errors, setErrors] = useState({
    companyname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let newErrors: any = {};
    if (!companyname) {
      newErrors = {
        ...newErrors,
        companyname: "Company name is required",
      };
    }

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

    if (password !== confirmPassword) {
      newErrors = {
        ...newErrors,
        confirmPassword: "Password do not match",
      };
    } else if (password.length < 6) {
      newErrors = {
        ...newErrors,
        password: "Password must be at least 6 characters long",
      };
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length) {
      return;
    }
    setLoading(true);

    const payload: any = {
      companyname,
      email,
      password,
    };
    const userId = localStorage.getItem("userId");
    if (userRole === "Sub-SuperAdmin") {
      payload.userId = userId;
    }

    const response: any = await CompanyApi.createCompany(payload);

    if (response.remote === "failure") {
      const backendError =
        response?.error?.errors?.message ||
        response?.error?.message ||
        "Something went wrong";

      if (backendError.includes("Company name")) {
        setErrors((prev) => ({
          ...prev,
          companyname: backendError,
        }));
        toast.error(backendError);
      } else if (backendError.includes("Email")) {
        setErrors((prev) => ({
          ...prev,
          email: backendError,
        }));
        toast.error(backendError);
      } else {
        toast.error(backendError);
      }

      setLoading(false);
      return;
    }

    if (response.remote === "success") {
      setCompanyId(response.data.data._id);
      toast.success("Company created successfully");
      router.push("/dashboard");

      // const smtpBox = document.getElementById(
      //   "smtp-settings"
      // ) as HTMLElement | null;
      // if (smtpBox) {
      //   smtpBox.scrollIntoView({ behavior: "smooth", block: "start" });
      // }
    }
    setLoading(false);
  };

  // const handleUpdate = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await CompanyApi.updateCompanyData(companyId as any, {
  //       smtpHost,
  //       smtpPort,
  //       smtpUserName,
  //       smtpPassword,
  //       smtpEncryption,
  //       smtpAddress,
  //     });
  //     console.log("Response--", response);
  //     if (response.remote === "success") {
  //       router.push("/dashboard");

  //       toast.success("Company updated successfully!");
  //     }
  //   } catch (error) {
  //     console.error("Error updating company:", error);
  //     toast.error("An error occurred while updating company.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleGoBack = () => {
    router.back();
  };
  return (
    <StylesStyled>
      <ToastContainer />
      <MainLayout>
        <Box sx={{ paddingLeft: "260px" }} className="addNew">
          <Box p={3}>
            <Box className="headerCompany">
              <SVG.Arrow onClick={handleGoBack} style={{ cursor: "pointer" }} />
              <h3>Add New Company</h3>
            </Box>
            <Box className="companyBox">
              <Box className="customLabel">
                <label>Company Name</label>
                <TextInput
                  type="text"
                  placeholder="Enter company name"
                  value={companyname}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </Box>
              <span
                style={{ color: "red", fontSize: "12px", marginLeft: "180px" }}
              >
                {errors.companyname}
              </span>
              <Box className="customLabel">
                <label>Company Email</label>
                <TextInput
                  type="text"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Box>
              <span
                style={{ color: "red", fontSize: "12px", marginLeft: "180px" }}
              >
                {errors.email}
              </span>
              <Box className="customLabel">
                <label>Password</label>
                <TextInput
                  type="password"
                  placeholder="************"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Box>
              <span
                style={{ color: "red", fontSize: "12px", marginLeft: "180px" }}
              >
                {errors.password}
              </span>
              <Box className="customLabel">
                <label>Confirm Password</label>
                <TextInput
                  type="password"
                  placeholder="************"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Box>
              <span
                style={{ color: "red", fontSize: "12px", marginLeft: "180px" }}
              >
                {errors.confirmPassword}
              </span>
              <Box
                sx={{
                  textAlign: "end",
                  paddingBottom: "22px",
                  marginTop: "24px",
                }}
              >
                <Button className="btnSubmit" onClick={handleSubmit}>
                  <SVG.Vector /> {loading ? "Submitting..." : "Submit"}
                </Button>
              </Box>
            </Box>
            {/* 
            <Box className="companyBox">
              <h4 id="smtp-settings">SMTP Settings</h4>
              <Grid container spacing={2}>
                <Grid size={6}>
                  <Box
                    className="customLabel"
                    sx={{ display: "block !important", margin: "0 !important" }}
                  >
                    <label style={{ paddingBottom: "6px" }}>SMTP Host</label>
                    <TextInput
                      type="text"
                      placeholder="Fachzubi"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                    />
                  </Box>
                </Grid>
                <Grid size={6}>
                  <Box
                    className="customLabel"
                    sx={{ display: "block !important", margin: "0 !important" }}
                  >
                    <label style={{ paddingBottom: "6px" }}>SMTP Port</label>
                    <TextInput
                      type="text"
                      placeholder="Fachzubi"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                    />
                  </Box>
                </Grid>
                <Grid size={6}>
                  <Box
                    className="customLabel"
                    sx={{ display: "block !important", margin: "0 !important" }}
                  >
                    <label style={{ paddingBottom: "6px" }}>
                      SMTP Username
                    </label>
                    <TextInput
                      type="text"
                      placeholder="Fachzubi"
                      value={smtpUserName}
                      onChange={(e) => setSmtpUserName(e.target.value)}
                    />
                  </Box>
                </Grid>
                <Grid size={6}>
                  <Box
                    className="customLabel"
                    sx={{ display: "block !important", margin: "0 !important" }}
                  >
                    <label style={{ paddingBottom: "6px" }}>
                      SMTP Password
                    </label>
                    <TextInput
                      type="password"
                      placeholder="************"
                      value={smtpPassword}
                      onChange={(e) => setSmtpPassword(e.target.value)}
                    />
                  </Box>
                </Grid>

                <Grid size={6}>
                  <Box
                    className="customLabel"
                    sx={{ display: "block !important", margin: "0 !important" }}
                  >
                    <label style={{ paddingBottom: "6px" }}>
                      SMTP Encryption
                    </label>
                    <TextInput
                      type="text"
                      placeholder="Fachzubi"
                      value={smtpEncryption}
                      onChange={(e) => setSmtpEncryption(e.target.value)}
                    />
                  </Box>
                </Grid>
                <Grid size={6}>
                  <Box
                    className="customLabel"
                    sx={{ display: "block !important", margin: "0 !important" }}
                  >
                    <label style={{ paddingBottom: "6px" }}>Form Address</label>
                    <TextInput
                      type="text"
                      placeholder="Fachzubi"
                      value={smtpAddress}
                      onChange={(e) => setSmtpAddresss(e.target.value)}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ textAlign: "end", padding: "22px 0" }}>
                <FilledButton className="btnSubmit" onClick={handleUpdate}>
                  <SVG.Vector /> {loading ? "Submitting..." : "Submit"}
                </FilledButton>
              </Box>
            </Box> */}
          </Box>
        </Box>
      </MainLayout>
    </StylesStyled>
  );
}
