import MainLayout from "@/components/layout";
import React, { useEffect, useState } from "react";
import LoginsStyled from "./settingStyled";
import { Box } from "@mui/material";
import { SVG } from "@/assets/svg";
import TextInput from "@/components/labelInput";
import FilledButton from "@/components/button";
import Grid from "@mui/material/Grid2";
import CheckboxLabels from "@/components/checkbox";
import SwitchButton from "@/components/switch";
import { useRouter } from "next/router";
import { CompanyApi } from "../api/company/CompanyApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

interface ManageCompanyData {
  companyId: string;
  jobListingPage: string[];
  jobWall: string[];
  sideMenu: string[];
  manageAppColor: boolean;
  manageJobAlarm: boolean;
  manageIndustries: boolean;
  manageCities: boolean;
  manageBanners: boolean;
  manageStatus: boolean;
  manageEmailServices: boolean;
}

export default function AccountSetting() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyname: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    smtpHost: "",
    smtpPort: "",
    smtpUserName: "",
    smtpPassword: "",
    smtpEncryption: "",
    smtpAddress: "",
    smtpService: "",
  });
  const [manageCompanyData, setManageCompanyData] = useState<ManageCompanyData>(
    {
      companyId: "",
      jobListingPage: [],
      jobWall: [],
      sideMenu: [],
      manageAppColor: false,
      manageJobAlarm: false,
      manageIndustries: false,
      manageCities: false,
      manageBanners: false,
      manageStatus: true,
      manageEmailServices: true,
    }
  );
  const [companyname, setCompanyname] = useState("");

  const handleGetCompany = async (id: string) => {
    try {
      setLoading(true);
      const response = await CompanyApi.getCompanyData(id);
      if (response.remote === "success") {
        const data = response.data.data;
        setFormData({
          ...formData,
          companyname: data.companyname,
          email: data.email,
          smtpHost: data.smtpHost || "",
          smtpPort: data.smtpPort || "",
          smtpUserName: data.smtpUserName || "",
          smtpPassword: data.smtpPassword || "",
          smtpEncryption: data.smtpEncryption || "",
          smtpAddress: data.smtpAddress || "",
          smtpService: data.smtpService || "",
        });
        setCompanyname(data.companyname);
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetManageCompany = async (id: string) => {
    try {
      setLoading(true);

      const response = await CompanyApi.getManageCompanyData(id);

      if (response.remote === "success") {
        const data = response.data.data;
        setManageCompanyData({
          ...manageCompanyData,
          companyId: data.companyId ?? "",
          jobListingPage: Array.isArray(data.jobListingPage)
            ? data.jobListingPage
            : [],
          jobWall: Array.isArray(data.jobWall) ? data.jobWall : [],
          sideMenu: Array.isArray(data.sideMenu) ? data.sideMenu : [],
          manageAppColor: !!data.manageAppColor,
          manageJobAlarm: !!data.manageJobAlarm, // Default to false if undefined
          manageIndustries: !!data.manageIndustries,
          manageCities: !!data.manageCities,
          manageBanners: !!data.manageBanners,
          manageStatus: !!data.manageStatus,
          manageEmailServices: !!data.manageEmailServices,
        });
      } else {
        toast.error("Failed to load company data!");
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (
    section: keyof ManageCompanyData,
    value: string
  ) => {
    setManageCompanyData((prev) => {
      const updatedSection = prev[section] as string[];

      const newValues = updatedSection.includes(value)
        ? updatedSection.filter((item) => item !== value)
        : [...updatedSection, value];

      if (newValues.length === 0 || newValues[0] === "") {
        return {
          ...prev,
          [section]: [],
        };
      }

      return {
        ...prev,
        [section]: newValues,
      };
    });
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setManageCompanyData((prev) => ({
      ...prev,
      [name]: checked,
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

    if (!formData.email) {
      toast.error("Email is required!")
    }

    setLoading(true);
    try {
      const {
        companyname,
        email,
        oldPassword,
        newPassword,
        smtpHost,
        smtpPort,
        smtpUserName,
        smtpPassword,
        smtpEncryption,
        smtpAddress,
        smtpService,
      } = formData;
      const response = await CompanyApi.updateCompanyData(id as string, {
        companyname,
        email,
        oldPassword,
        newPassword,
        smtpHost,
        smtpPort,
        smtpUserName,
        smtpPassword,
        smtpEncryption,
        smtpAddress,
        smtpService,
      });

      if (response.remote === "success") {
        toast.success("Company updated successfully!");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("An error occurred while updating company.");
    } finally {
      setLoading(false);
    }
  };

  const handleManageSection = async () => {
    try {
      const response = await CompanyApi.updateManageCompany(
        id as string,
        manageCompanyData
      );

      if (response.remote === "success") {
        toast.success("Company updated successfully!");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("An error occurred while updating company.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && typeof id === "string") {
      handleGetCompany(id);
      handleGetManageCompany(id);
    }
  }, [id]);

  const handleGoBack = () => {
    router.back(); // Navigate to the previous page
  };

  return (
    <LoginsStyled>
      <ToastContainer />
      <MainLayout>
        <Box sx={{ paddingLeft: "260px" }} className="adNew">
          <Box p={3}>
            <Box className="headerCompany">
              <SVG.Arrow
                onClick={handleGoBack}
                style={{ cursor: "pointer" }}
                onChange="disable"
              />
              <h3>{`Settings ${companyname}`}</h3>
            </Box>
            <Box className="companyBox">
              <h4>Manage Admin</h4>
              <Box className="customLabel">
                <label>Company Name</label>
                <TextInput
                  name="companyname"
                  type="text"
                  placeholder=""
                  value={formData.companyname}
                  onChange={handleChange}
                />
              </Box>
              <Box className="customLabel">
                <label>Company Email</label>
                <TextInput
                  name="email"
                  type="text"
                  placeholder=""
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
                />
              </Box>
              <Box className="customLabel">
                <label>New Password</label>
                <TextInput
                  name="newPassword"
                  type="password"
                  placeholder="************"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </Box>
              <Box className="customLabel">
                <label>Confirm Password</label>
                <TextInput
                  type="password"
                  name="confirmPassword"
                  placeholder="************"
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
            <Box className="companyBox">
              <Box>
                <h6>Manage Job Listing page:</h6>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "60%",
                    width: "60%",
                  }}
                >
                  <CheckboxLabels
                    label="region wahlen"
                    checked={manageCompanyData.jobListingPage?.includes(
                      "region wahlen"
                    )}
                    onChange={() =>
                      handleCheckboxChange("jobListingPage", "region wahlen")
                    }
                  />
                  <CheckboxLabels
                    label="branche"
                    checked={manageCompanyData.jobListingPage?.includes(
                      "branche"
                    )}
                    onChange={() =>
                      handleCheckboxChange("jobListingPage", "branche")
                    }
                  />
                </Box>
              </Box>
              <Box>
                <h6>Manage Job wall:</h6>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "60%",
                    width: "60%",
                  }}
                >
                  <CheckboxLabels
                    label="Industries"
                    checked={manageCompanyData.jobWall?.includes("Industries")}
                    onChange={() =>
                      handleCheckboxChange("jobWall", "Industries")
                    }
                  />
                  <CheckboxLabels
                    label="location text & location icon"
                    checked={manageCompanyData.jobWall?.includes(
                      "location text & location icon"
                    )}
                    onChange={() =>
                      handleCheckboxChange(
                        "jobWall",
                        "location text & location icon"
                      )
                    }
                  />
                </Box>
              </Box>
              <Box>
                <h6>Manage Side menu:</h6>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "60%",
                    width: "60%",
                  }}
                >
                  <CheckboxLabels
                    label="Change logo"
                    checked={manageCompanyData.sideMenu?.includes(
                      "Change logo"
                    )}
                    onChange={() =>
                      handleCheckboxChange("sideMenu", "Change logo")
                    }
                  />
                  <CheckboxLabels
                    label="Bewerbung Tips"
                    checked={manageCompanyData.sideMenu?.includes(
                      "Bewerbung Tips"
                    )}
                    onChange={() =>
                      handleCheckboxChange("sideMenu", "Bewerbung Tips")
                    }
                  />
                </Box>
              </Box>
              {/* <Box className="manageBox">
                <h5>Manage App Color</h5>
                <SwitchButton
                  name="manageAppColor"
                  checked={manageCompanyData.manageAppColor}
                  onChange={handleSwitchChange}
                />
              </Box> */}
              {/* <Box className="manageBox">
                <h5>Manage job alarm</h5>
                <SwitchButton
                  name="manageJobAlarm"
                  checked={manageCompanyData.manageJobAlarm}
                  onChange={handleSwitchChange}
                />
              </Box> */}
              <Box className="manageBox">
                <h5>Manage Industries</h5>
                <SwitchButton
                  name="manageIndustries"
                  checked={manageCompanyData.manageIndustries}
                  onChange={handleSwitchChange}
                />
              </Box>
              <Box className="manageBox">
                <Link href={`/manage-cities?id=${id}`}>
                  <h5>Manage Cities</h5>
                </Link>
                <SwitchButton
                  name="manageCities"
                  checked={manageCompanyData.manageCities}
                  onChange={handleSwitchChange}
                />
              </Box>
              <Box className="manageBox">
                <h5>Manage Banners</h5>
                <SwitchButton
                  name="manageBanners"
                  checked={manageCompanyData.manageBanners}
                  onChange={handleSwitchChange}
                />
              </Box>
              <Box className="manageBox">
                <h5>Manage Company Status</h5>
                <SwitchButton
                  name="manageStatus"
                  checked={manageCompanyData.manageStatus}
                  onChange={handleSwitchChange}
                />
              </Box>
              <Box className="manageBox">
                <h5>Manage Email service</h5>
                <SwitchButton
                  name="manageEmailServices"
                  checked={manageCompanyData.manageEmailServices}
                  onChange={handleSwitchChange}
                />
              </Box>
              <Box sx={{ textAlign: "end", padding: "22px 0" }}>
                <FilledButton
                  className="btnSubmit"
                  onClick={handleManageSection}
                  disabled={loading}
                >
                  <SVG.Vector /> {loading ? "Submitting..." : "Submit"}
                </FilledButton>
              </Box>
            </Box>
            <Box className="companyBox">
              <h4>SMTP Settings</h4>
              <Grid container spacing={2}>
                <Grid size={6}>
                  <Box
                    className="customLabel"
                    sx={{ display: "block !important", margin: "0 !important" }}
                  >
                    <label style={{ paddingBottom: "6px" }}>SMTP Host</label>
                    <TextInput
                      type="text"
                      name="smtpHost"
                      placeholder=""
                      value={formData.smtpHost}
                      onChange={handleChange}
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
                      name="smtpPort"
                      placeholder=""
                      value={formData.smtpPort}
                      onChange={handleChange}
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
                      name="smtpUserName"
                      placeholder=""
                      value={formData.smtpUserName}
                      onChange={handleChange}
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
                      name="smtpPassword"
                      placeholder=""
                      value={formData.smtpPassword}
                      onChange={handleChange}
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
                      name="smtpEncryption"
                      placeholder=""
                      value={formData.smtpEncryption}
                      onChange={handleChange}
                    />
                  </Box>
                </Grid>
                <Grid size={6}>
                  <Box
                    className="customLabel"
                    sx={{ display: "block !important", margin: "0 !important" }}
                  >
                    <label style={{ paddingBottom: "6px" }}>From Address</label>
                    <TextInput
                      type="text"
                      name="smtpAddress"
                      placeholder=""
                      value={formData.smtpAddress}
                      onChange={handleChange}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ textAlign: "end", padding: "22px 0" }}>
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
