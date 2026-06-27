import { SVG } from "@/assets/svg";
import { AuthApi } from "@/pages/api/auth/AuthApi";
import { Box } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import logo1 from "../../assets/svg/logo1.jpg";

export default function Sidebar() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [permission, setPermission] = useState({
    manageJobAlarmContent: false,
    manageJobFormContent: false,
    manageMeineDaten: false,
    managePolicy: false,
    manageImpressum: false,
  });

  const handleDetails = async () => {
    setLoading(true);
    const response = await AuthApi.getSuperAdminData();
    if (response.remote === "success") {
      setRole(response.data.data.role);
      setPermission({
        manageJobAlarmContent: response.data.data.manageJobAlarmContent,
        manageJobFormContent: response.data.data.manageJobFormContent,
        manageMeineDaten: response.data.data.manageMeineDaten,
        managePolicy: response.data.data.managePolicy,
        manageImpressum: response.data.data.manageImpressum,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    handleDetails();
  }, []);

  const handleLogout = async () => {
    const response = await AuthApi.logout();
    if (response.remote === "success") {
      localStorage.removeItem("access-token");
      localStorage.removeItem("refresh-token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      router.push("/");
    } else {
      return response.error;
    }
  };

  const currentHost =
    typeof window !== "undefined" ? window.location.hostname : "";

  const superAdminHosts = [
    "azubi.super-admin.digimonk.net", // dev
    "superadmin.kundenzugang-companyjob.app", // live
  ];

  const showLogo = superAdminHosts.includes(currentHost);

  return (
    <Box className="sidebar">
      {/* <Link href="/"> */}
      <Box className="icons">
        {/* <SVG.Icon /> */}
        {showLogo && (
          <img
            src={logo1.src}
            alt="Company Job APP"
            style={{ width: "150px", height: "auto" }}
          />
        )}
      </Box>
      {/* </Link> */}
      <ul>
        <Link href="/dashboard">
          <li
            className={
              router.pathname === "/dashboard" ||
              router.pathname === "/dashboard/add-new-company" ||
              router.pathname === "/account-setting"
                ? "activeClass"
                : ""
            }
          >
            <SVG.User /> User Management
          </li>
        </Link>
        {role === "Sub-SuperAdmin" && (
          <Link href="/manage-jobs">
            {" "}
            <li
              className={
                router.pathname === "/manage-jobs" ||
                router.pathname === "/manage-jobs/add-new"
                  ? "activeClass"
                  : ""
              }
            >
              <SVG.Admin /> Manage Jobs
            </li>
          </Link>
        )}
        <Link href="/superadmin-setting">
          {" "}
          <li
            className={
              router.pathname === "/superadmin-setting" ? "activeClass" : ""
            }
          >
            <SVG.Admin /> Superadmin Settings
          </li>
        </Link>
        {role !== "Sub-SuperAdmin" && (
          <Link href="/sub-superadmin">
            {" "}
            <li
              className={
                router.pathname === "/sub-superadmin" ||
                router.pathname === "/sub-superadmin/add-new"
                  ? "activeClass"
                  : ""
              }
            >
              <SVG.Admin /> Sub Superadmin
            </li>
          </Link>
        )}
        {permission.managePolicy && (
          <Link href="/manage-policy">
            {" "}
            <li
              className={
                router.pathname === "/manage-policy" ? "activeClass" : ""
              }
            >
              <SVG.Types /> Manage Datenschutz
            </li>
          </Link>
        )}
        {permission.manageImpressum && (
          <Link href="/manage-impressum">
            {" "}
            <li
              className={
                router.pathname === "/manage-impressum" ? "activeClass" : ""
              }
            >
              <SVG.Types /> Manage Impressum
            </li>
          </Link>
        )}
        {permission.manageMeineDaten && (
          <Link href="/manage-meine-daten">
            {" "}
            <li
              className={
                router.pathname === "/manage-meine-daten" ? "activeClass" : ""
              }
            >
              <SVG.User /> Manage Meine Daten
            </li>
          </Link>
        )}
        {permission.manageJobAlarmContent && (
          <Link href="/job-alarm-content">
            {" "}
            <li
              className={
                router.pathname === "/job-alarm-content" ? "activeClass" : ""
              }
            >
              <SVG.Alarm /> Manage Job Alarm Content
            </li>
          </Link>
        )}
        {permission.manageJobFormContent && (
          <Link href="/job-form-content">
            {" "}
            <li
              className={
                router.pathname === "/job-form-content" ? "activeClass" : ""
              }
            >
              <SVG.Alarm /> Manage Begleitschreiben
            </li>
          </Link>
        )}
        <li onClick={handleLogout}>
          <SVG.Logout />
          Log Out
        </li>
      </ul>
    </Box>
  );
}
