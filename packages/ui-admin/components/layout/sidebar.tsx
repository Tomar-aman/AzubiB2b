"use client";
import { AuthApi } from "@/app/api/auth/AuthApi";
import { ManageCompanyApi } from "@/app/api/manageCompany/ManageCompanyApi";
import { SVG } from "@/assets/svg";
import { setCompany } from "@monorepo/ui-core/src/redux/slices/globaCache.slice";
import { Box, Button, Dialog, Typography } from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

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
}

export default function Sidebar() {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [link, setLink] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [logoChangeable, setLogoChangeable] = useState(false);
  const [tipsChangeable, setTipsChangeable] = useState(false);
  const [qrCode, setQRCode] = useState("");
  const [qrOpen, setQrOpen] = useState(false);
  const [selectedQr, setSelectedQr] = useState<string>("");
  const pathName = usePathname();
  const [companyName, setCompanyName] = useState<string>("");
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
    },
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("companyId");
    router.push(`/?company=${companyName}`);
  };
  // const [link, setLink] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // Track loading state
  useEffect(() => {
    const savedLinkState = localStorage.getItem("sidebarOpen");

    // Ensure `setLink` is called only when localStorage has a valid value
    if (savedLinkState !== null) {
      setLink(savedLinkState === "true");
    }

    setIsLoaded(true); // Mark loading as complete
  }, []);

  useEffect(() => {
    const getUserDetails = async () => {
      const res: any = await AuthApi.getCompanyById();

      if (res.remote === "success") {
        const company = res.data.data[0];
        setQRCode(company.qrCode);
        setCompanyName(company.companyname);
        // @ts-ignore
        dispatch(setCompany(res.data.data[0]));
      }
    };
    getUserDetails();
  }, [dispatch]);

  // Function to toggle sidebar and save state
  const toggleSidebar = () => {
    setLink((prev) => {
      const newLinkState = !prev; // Toggle the state
      localStorage.setItem("sidebarOpen", JSON.stringify(newLinkState)); // Save as string
      return newLinkState; // Return the new state
    });
  };

  const handleGetManageCompany = async () => {
    try {
      setLoading(true);

      const response = await ManageCompanyApi.getManageCompanyData();

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
    handleGetManageCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const isLogoChangeable = manageCompanyData.sideMenu.includes("Change logo");
    const isTipsChangeable =
      manageCompanyData.sideMenu.includes("Bewerbung Tips");
    setLogoChangeable(isLogoChangeable);
    setTipsChangeable(isTipsChangeable);
  }, [manageCompanyData]);

  const handleOpenQr = (qr: string) => {
    setSelectedQr(qr);
    setQrOpen(true);
  };

  const handleCloseQr = () => {
    setQrOpen(false);
  };

  const handleCopyQr = async () => {
    try {
      if (!qrCode) return;

      // Convert base64 to Blob
      const base64 = qrCode.split(",")[1];
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length)
        .fill(0)
        .map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" });

      // Copy Blob as image to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);

      alert("Copied!");
    } catch (error) {
      console.error("Failed to copy QR image:", error);
    }
  };

  return (
    <Box className="sidebar">
      <Box className="icons">
        {qrCode ? (
          <img
            src={qrCode}
            alt="QR Code"
            width={50}
            height={50}
            style={{ borderRadius: "8px" }}
            onClick={() => handleOpenQr(qrCode)}
          />
        ) : (
          <SVG.Icon />
        )}
        {companyName && (
          <p
            style={{
              fontSize: "14px",
              fontWeight: 600,
              marginTop: "6px",
              marginLeft: "5px",
              textAlign: "center",
              color: "#333",
              fontFamily: "Poppins",
            }}
          >
            {companyName}
          </p>
        )}
      </Box>
      <ul>
        {/* <Link href="/dashboard">
          <li className={pathName === "/dashboard" ? "activeClass" : ""}>
            <SVG.Dashboard /> Dashboard
          </li>
        </Link> */}
        <Link href="/admin-setting">
          {" "}
          <li className={pathName === "/admin-setting" ? "activeClass" : ""}>
            <SVG.Admin />
            Admin Settings
          </li>
        </Link>
        <Link href="/manage-company">
          {" "}
          <li
            className={
              pathName === "/manage-company" ||
              pathName === "/manage-company/edit-company"
                ? "activeClass"
                : ""
            }
          >
            <SVG.Company />
            Manage Company
          </li>
        </Link>
        <Link href="/manage-jobs">
          <li
            className={
              pathName === "/manage-jobs" || pathName === "/manage-jobs/add-job"
                ? "activeClass"
                : ""
            }
          >
            <SVG.Jobs />
            Manage Jobs
          </li>
        </Link>
        <Link href="/trash">
          {" "}
          <li
            className={pathName === "/trash" ? "activeClass trash" : "trash "}
          >
            <SVG.Remove /> Trash
          </li>{" "}
        </Link>
        <Link
          href={`${manageCompanyData?.manageIndustries ? "/manage-industry" : "/warning-page"}`}
        >
          {" "}
          <li
            className={
              pathName === "/manage-industry" ||
              pathName === "/manage-industry/add-industry"
                ? "activeClass"
                : ""
            }
          >
            <SVG.Industry />
            Manage Industries
          </li>
        </Link>
        <Link href="/job-types">
          {" "}
          <li
            className={
              pathName === "/job-types" || pathName === "/job-types/add-job"
                ? "activeClass"
                : ""
            }
          >
            <SVG.Types />
            Job Types
          </li>
        </Link>
        <Link
          href={`${manageCompanyData?.manageCities ? "/manage-cities" : "/warning-page"}`}
        >
          {" "}
          <li
            className={
              pathName === "/manage-cities" ||
              pathName === "/manage-cities/add-city"
                ? "activeClass"
                : ""
            }
          >
            <SVG.Cities />
            Manage Cities
          </li>
        </Link>
        {/* <Link href="/manage-sidebar"> */}{" "}

        {/* <li className="" style={{ cursor: "pointer" }} onClick={toggleShow}>
          <SVG.Tools />
          Content Management{" "}
          <SVG.Down className={show ? "sideSvg rotate" : "sideSvg"} />
        </li>
        {show && (
          <Box className="innerDetailBox">
            <Link href="/manage-sidemenu">
              {" "}
              <li
                className={pathName === "/manage-sidemenu" ? "activeClass" : ""}
              >
                <SVG.Tools />
                Manage Side Menu
              </li>
            </Link>
            <Link href="/job-wall">
              {" "}
              <li className={pathName === "/job-wall" ? "activeClass" : ""}>
                <SVG.Types />
                Manage Job Wall
              </li>
            </Link>
          </Box>
        )}
        <li className="" style={{ cursor: "pointer" }} onClick={toggleLink}>
          <SVG.Tools />
          Sidebar <SVG.Down className={link ? "sideSvg rotate" : "sideSvg"} />
        </li>
        {link && (
          <Box className="innerDetailBox">
            <Link href="/manage-sidebar">
              {" "}
              <li
                onClick={() => setLink(true)}
                className={pathName === "/manage-sidebar" ? "activeClass" : ""}
              >
                <SVG.Tools />
                Manage SideBar
              </li>
            </Link>
            <Link href="/manage-tips">
              {" "}
              <li className={pathName === "/manage-tips" ? "activeClass" : ""}>
                <SVG.Types />
                Manage Tips
              </li>
            </Link>
            <Link href="/manage-alarm">
              {" "}

        )} */}
        {/* <li className="" style={{ cursor: "pointer" }} onClick={toggleSidebar}>
          <SVG.Tools />
          Sidebar <SVG.Down className={link ? "sideSvg rotate" : "sideSvg"} />
        </li> */}
        {/* No flicker issue now */}
        {/* {link && (
          <Box className="innerDetailBox">
            {logoChangeable && (
              <Link href="/manage-sidebar">
                <li
                  className={
                    pathName === "/manage-sidebar" ? "activeClass" : ""
                  }
                >
                  <SVG.Tools />
                  Manage SideBar
                </li>
              </Link>
            )}
            {tipsChangeable && (
              <Link href="/manage-tips">
                <li
                  className={pathName === "/manage-tips" ? "activeClass" : ""}
                >
                  <SVG.Types />
                  Manage Tips
                </li>
              </Link>
            )}
            <Link
              href={
                manageCompanyData?.manageJobAlarm
                  ? "/manage-alarm"
                  : "/warning-page"
              }
            >
              <li className={pathName === "/manage-alarm" ? "activeClass" : ""}>
                <SVG.Types />
                Manage Alarm
              </li>
            </Link>
          </Box>
        )} */}
        {/* </Link> */}
        <Link
          href={`${manageCompanyData?.manageBanners ? "/manage-banners" : "/warning-page"}`}
        >
          {" "}
          <li
            className={
              pathName === "/manage-banners" ||
              pathName === "/manage-banners/add-banner"
                ? "activeClass"
                : ""
            }
          >
            <SVG.Banners />
            Manage Banners
          </li>
        </Link>
        <Link href={"/manage-news"}>
          {" "}
          <li
            className={
              pathName === "/manage-news" ||
              pathName === "/manage-news/add-news"
                ? "activeClass"
                : ""
            }
          >
            <SVG.Banners />
            Manage News
          </li>
        </Link>
        <Link href="/manage-policy">
          <li className={pathName === "/manage-policy" ? "activeClass" : ""}>
            <SVG.Types />
            Manage Policy
          </li>
        </Link>
        <Link href="/manage-appointment-content">
          <li
            className={
              pathName === "/manage-appointment-content" ? "activeClass" : ""
            }
          >
            <SVG.Applic />
            Manage Appointment Content
          </li>
        </Link>
        {/* <Link
          href={`${manageCompanyData?.manageAppColor ? "/manage-app-color" : "/warning-page"}`}
        >
          {" "}
          <li className={pathName === "/manage-app-color" ? "activeClass" : ""}>
            <SVG.Contact />
            Manage App Color
          </li>
        </Link> */}
        {/* <Link href="/contact"> <li className={pathName === '/contact' ? 'activeClass' : ''}><SVG.Contact />Contact</li></Link> */}
        <Link href="/application-sent-history">
          {" "}
          <li
            className={
              pathName === "/application-sent-history" ||
              pathName === "/application-sent-history/add-history"
                ? "activeClass"
                : ""
            }
          >
            <SVG.Applic />
            Application sent history
          </li>
        </Link>
        <Link href="/job-alarm">
          {" "}
          <li className={pathName === "/job-alarm" ? "activeClass" : ""}>
            <SVG.Alarm />
            Job alarm history registration
          </li>
        </Link>
        {/* <Link href="/side-menu-content">
          {" "}
          <li
            className={
              pathName === "/side-menu-content" ||
              pathName === "/side-menu-content/add-menu-content"
                ? "activeClass"
                : ""
            }
          >
            <SVG.Content />
            Side menu content
          </li>
        </Link>

=======
        </Link> */}
        {/* <Link href="/warning-page">
          {" "}
          <li>
            <SVG.Content />
            test
          </li>
        </Link> */}
        <Link href="/push-notification">
          {" "}
          <li
            className={pathName === "/push-notification" ? "activeClass" : ""}
          >
            <SVG.Content />
            Push Notification
          </li>
        </Link>
        <Link href={`/?company=${companyName}`} onClick={handleLogout}>
          {" "}
          <li>
            <SVG.Logout /> Log Out
          </li>
        </Link>
      </ul>

      {/* Open QR code */}
      <Dialog
        open={qrOpen}
        onClose={handleCloseQr}
        PaperProps={{
          style: {
            borderRadius: "20px",
            padding: "0",
            overflow: "hidden",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
          },
        }}
      >
        <Box
          sx={{
            background: "#ffffff",
            padding: "32px 32px 24px",
            textAlign: "center",
            width: "340px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: 600,
              fontFamily: "Poppins",
            }}
          >
            {/* {selectedCompanyId} */}
          </h2>
          <Box
            sx={{
              background: "#fff",
              padding: "20px",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={selectedQr}
              alt="QR Code"
              width={230}
              height={230}
              style={{ display: "block" }}
            />
          </Box>
          <Typography
            sx={{
              marginTop: "20px",
              fontSize: "16px",
              fontWeight: 600,
              color: "#202124",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Scan to Open Company App
          </Typography>
          <Button
            onClick={handleCopyQr}
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#1A73E8",
              marginTop: "22px",
              borderRadius: "10px",
              padding: "10px",
              fontSize: "15px",
              textTransform: "none",
              "&:hover": { backgroundColor: "#1669c1" },
            }}
            startIcon={
              <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z"></path>
              </svg>
            }
          >
            Copy QR
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}
