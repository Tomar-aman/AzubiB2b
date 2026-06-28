import MainLayout from "@/components/layout";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Chip,
  Button,
  Grid,
  Paper,
  Avatar,
  Divider,
  Switch,
  Link as MuiLink,
} from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import DashboardStyled from "../../dashboard/dashboardStyled";
import { CompanyApi } from "../../api/company/CompanyApi";

interface FachzubiMeta {
  jobTitle?: string;
  zipCode?: string;
  videoLink?: string[];
  regionName?: string;
}

interface CompanyDetail {
  _id: string;
  companyname?: string;
  email?: string;
  contactPerson?: string;
  phoneNumber?: string;
  location?: string;
  websiteLink?: string;
  description?: string;
  profileIcon?: string;
  companyImages?: { file: string }[];
  city?: { name?: string; address?: string } | null;
  industryName?: { industryName?: string } | null;
  status?: boolean;
  fachzubiId?: string;
  fachzubiMeta?: FachzubiMeta;
  qrCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

function Field({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        sx={{
          fontFamily: "Poppins",
          fontSize: 12,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          color: "#8a8a8a",
          mb: 0.3,
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ fontFamily: "Poppins", fontSize: 15, color: "#222", wordBreak: "break-word" }}>
        {value || "—"}
      </Typography>
    </Box>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 2, mb: 3, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
      <Typography sx={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 17, mb: 2 }}>
        {title}
      </Typography>
      <Divider sx={{ mb: 2.5 }} />
      {children}
    </Paper>
  );
}

export default function FachzubiCompanyDetails() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [toggling, setToggling] = useState(false);

  const fetchCompany = async (companyId: string) => {
    setLoading(true);
    const res: any = await CompanyApi.getFachzubiCompany(companyId);
    if (res?.remote === "success" && res.data) {
      setCompany(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (id) fetchCompany(id);
  }, [id]);

  const handleToggle = async () => {
    if (!company) return;
    setToggling(true);
    const res: any = await CompanyApi.toggleFachzubiCompanyStatus(company._id);
    if (res?.remote === "success") {
      setCompany((prev) => (prev ? { ...prev, status: res.data.status } : prev));
    }
    setToggling(false);
  };

  const handleCopyQr = async () => {
    try {
      if (!company?.qrCode) return;
      const base64 = company.qrCode.split(",")[1];
      const byteNumbers = atob(base64)
        .split("")
        .map((c) => c.charCodeAt(0));
      const blob = new Blob([new Uint8Array(byteNumbers)], { type: "image/png" });
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      alert("QR copied!");
    } catch {
      alert("Could not copy QR.");
    }
  };

  const handleDownloadQr = () => {
    if (!company?.qrCode) return;
    const a = document.createElement("a");
    a.href = company.qrCode;
    a.download = `${company.companyname || "company"}-qr.png`;
    a.click();
  };

  const meta = company?.fachzubiMeta ?? {};
  const videoLinks = Array.isArray(meta.videoLink) ? meta.videoLink : [];
  const images = Array.isArray(company?.companyImages) ? company!.companyImages : [];

  return (
    <DashboardStyled>
      <MainLayout>
        <Box className="dashboardContent">
          <Box sx={{ p: 4 }}>
            <Button
              onClick={() => router.push("/fachzubi-companies")}
              sx={{ fontFamily: "Poppins", textTransform: "none", mb: 2, color: "#555" }}
            >
              ← Back to Companies
            </Button>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
              </Box>
            ) : !company ? (
              <Typography sx={{ fontFamily: "Poppins" }}>Company not found.</Typography>
            ) : (
              <>
                {/* Header */}
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    flexWrap: "wrap",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  }}
                >
                  <Avatar
                    src={company.profileIcon || undefined}
                    alt={company.companyname}
                    sx={{ width: 84, height: 84, bgcolor: "#eef2ff", color: "#3949ab", fontSize: 30, fontWeight: 600 }}
                  >
                    {company.companyname?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 200 }}>
                    <Typography sx={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 24 }}>
                      {company.companyname || "—"}
                    </Typography>
                    <Typography sx={{ fontFamily: "Poppins", color: "#777", fontSize: 14 }}>
                      {company.industryName?.industryName || "No industry"}
                      {company.city?.name ? ` · ${company.city.name}` : ""}
                    </Typography>
                    <Chip
                      label={company.status ? "Active" : "Inactive"}
                      size="small"
                      sx={{
                        mt: 1,
                        background: company.status ? "#e6f4ea" : "#fce8e6",
                        color: company.status ? "#1e7e34" : "#c5221f",
                        fontFamily: "Poppins",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Typography sx={{ fontFamily: "Poppins", fontSize: 12, color: "#888" }}>
                      Change Status
                    </Typography>
                    <Switch
                      checked={Boolean(company.status)}
                      disabled={toggling}
                      onChange={handleToggle}
                      color="success"
                    />
                  </Box>
                </Paper>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <SectionCard title="Contact Information">
                      <Field label="Email" value={company.email} />
                      <Field label="Contact Person" value={company.contactPerson} />
                      <Field label="Phone Number" value={company.phoneNumber} />
                      <Field
                        label="Website"
                        value={
                          company.websiteLink ? (
                            <MuiLink href={company.websiteLink} target="_blank" rel="noreferrer">
                              {company.websiteLink}
                            </MuiLink>
                          ) : undefined
                        }
                      />
                      <Field label="Job Title" value={meta.jobTitle} />
                    </SectionCard>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <SectionCard title="Location & Category">
                      <Field label="Address / Location" value={company.location} />
                      <Field label="City" value={company.city?.name} />
                      <Field label="Region" value={meta.regionName} />
                      <Field label="Zip Code" value={meta.zipCode} />
                      <Field label="Industry" value={company.industryName?.industryName} />
                    </SectionCard>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <SectionCard title="App QR Code">
                      {company.qrCode ? (
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
                          <Box
                            component="img"
                            src={company.qrCode}
                            alt="Company QR"
                            sx={{ width: 200, height: 200, borderRadius: 1.5, border: "1px solid #eee" }}
                          />
                          <Typography sx={{ fontFamily: "Poppins", fontSize: 13, color: "#777" }}>
                            Scan to open this company in the AzubiB2B app
                          </Typography>
                          <Box sx={{ display: "flex", gap: 1.5 }}>
                            <Button variant="outlined" onClick={handleCopyQr} sx={{ fontFamily: "Poppins", textTransform: "none" }}>
                              Copy
                            </Button>
                            <Button variant="contained" onClick={handleDownloadQr} sx={{ fontFamily: "Poppins", textTransform: "none" }}>
                              Download
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        <Typography sx={{ fontFamily: "Poppins", color: "#999" }}>
                          QR not generated yet. Re-sync this company from Fachzubi.
                        </Typography>
                      )}
                    </SectionCard>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <SectionCard title="Description">
                      <Typography sx={{ fontFamily: "Poppins", fontSize: 15, color: "#333", whiteSpace: "pre-wrap" }}>
                        {company.description || "—"}
                      </Typography>
                    </SectionCard>
                  </Grid>

                  {videoLinks.length > 0 && (
                    <Grid item xs={12}>
                      <SectionCard title="Video Links">
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          {videoLinks.map((v, i) => (
                            <MuiLink key={i} href={v} target="_blank" rel="noreferrer" sx={{ wordBreak: "break-all" }}>
                              {v}
                            </MuiLink>
                          ))}
                        </Box>
                      </SectionCard>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <SectionCard title={`Company Photos${images.length ? ` (${images.length})` : ""}`}>
                      {images.length > 0 ? (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                          {images.map((img, i) => (
                            <Box
                              key={i}
                              component="img"
                              src={img.file}
                              alt={`company-${i}`}
                              sx={{
                                width: 160,
                                height: 120,
                                objectFit: "cover",
                                borderRadius: 1.5,
                                border: "1px solid #eee",
                              }}
                            />
                          ))}
                        </Box>
                      ) : (
                        <Typography sx={{ fontFamily: "Poppins", color: "#999" }}>
                          No photos uploaded.
                        </Typography>
                      )}
                    </SectionCard>
                  </Grid>

                  <Grid item xs={12}>
                    <SectionCard title="Record Info">
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Field label="Fachzubi ID" value={company.fachzubiId} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Field
                            label="Added On"
                            value={company.createdAt ? dayjs(company.createdAt).format("DD MMM YYYY, hh:mm A") : undefined}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Field
                            label="Last Updated"
                            value={company.updatedAt ? dayjs(company.updatedAt).format("DD MMM YYYY, hh:mm A") : undefined}
                          />
                        </Grid>
                      </Grid>
                    </SectionCard>
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        </Box>
      </MainLayout>
    </DashboardStyled>
  );
}
