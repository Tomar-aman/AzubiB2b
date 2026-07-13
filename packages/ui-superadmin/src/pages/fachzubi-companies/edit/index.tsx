import MainLayout from "@/components/layout";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Grid,
  Paper,
  Divider,
  TextField,
  Switch,
  FormControlLabel,
  Stack,
} from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import DashboardStyled from "../../dashboard/dashboardStyled";
import { CompanyApi } from "../../api/company/CompanyApi";

interface CompanyMeta {
  jobTitle?: string;
  zipCode?: string;
  regionName?: string;
  videoLink?: string[];
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
  instagram?: string;
  twitter?: string;
  facebook?: string;
  companyImages?: { file: string }[];
  city?: { name?: string; address?: string } | null;
  industryName?: { industryName?: string } | null;
  status?: boolean;
  fachzubiId?: string;
  fachzubiMeta?: CompanyMeta;
  qrCode?: string;
  createdAt?: string;
  updatedAt?: string;
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

function ReadOnly({ label, value }: { label: string; value?: React.ReactNode }) {
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

export default function FachzubiCompanyEdit() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [companyImages, setCompanyImages] = useState<{ file: string }[]>([]);

  const [form, setForm] = useState({
    companyname: "",
    email: "",
    contactPerson: "",
    phoneNumber: "",
    location: "",
    websiteLink: "",
    description: "",
    profileIcon: "",
    instagram: "",
    twitter: "",
    facebook: "",
    status: true,
    // meta
    jobTitle: "",
    zipCode: "",
    regionName: "",
    videoLink: "", // newline-separated in the textarea
  });

  const fetchCompany = async (companyId: string) => {
    setLoading(true);
    const res: any = await CompanyApi.getFachzubiCompany(companyId);
    if (res?.remote === "success" && res.data) {
      const c: CompanyDetail = res.data;
      const meta = c.fachzubiMeta ?? {};
      setCompany(c);
      setCompanyImages(Array.isArray(c.companyImages) ? c.companyImages : []);
      setForm({
        companyname: c.companyname ?? "",
        email: c.email ?? "",
        contactPerson: c.contactPerson ?? "",
        phoneNumber: c.phoneNumber ?? "",
        location: c.location ?? "",
        websiteLink: c.websiteLink ?? "",
        description: c.description ?? "",
        profileIcon: c.profileIcon ?? "",
        instagram: c.instagram ?? "",
        twitter: c.twitter ?? "",
        facebook: c.facebook ?? "",
        status: Boolean(c.status),
        jobTitle: meta.jobTitle ?? "",
        zipCode: meta.zipCode ?? "",
        regionName: meta.regionName ?? "",
        videoLink: Array.isArray(meta.videoLink) ? meta.videoLink.join("\n") : "",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (id) fetchCompany(id);
  }, [id]);

  const change = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;
    setUploading(true);
    const res: any = await CompanyApi.uploadFachzubiFiles([file], "image");
    if (res?.remote === "success" && res.data?.files?.[0]?.file) {
      change("profileIcon", res.data.files[0].file);
    } else {
      alert("Failed to upload logo.");
    }
    setUploading(false);
  };

  const handleAddImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    e.target.value = "";
    if (!files.length) return;
    setUploading(true);
    const res: any = await CompanyApi.uploadFachzubiFiles(files, "image");
    if (res?.remote === "success" && Array.isArray(res.data?.files)) {
      const added = res.data.files.map((f: any) => ({ file: f.file }));
      setCompanyImages((prev) => [...prev, ...added]);
    } else {
      alert("Failed to upload images.");
    }
    setUploading(false);
  };

  const handleRemoveImage = (index: number) => {
    setCompanyImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    const payload = {
      companyname: form.companyname,
      email: form.email,
      contactPerson: form.contactPerson,
      phoneNumber: form.phoneNumber,
      location: form.location,
      websiteLink: form.websiteLink,
      description: form.description,
      profileIcon: form.profileIcon,
      instagram: form.instagram,
      twitter: form.twitter,
      facebook: form.facebook,
      status: form.status,
      companyImages,
      fachzubiMeta: {
        jobTitle: form.jobTitle,
        zipCode: form.zipCode,
        regionName: form.regionName,
        videoLink: form.videoLink
          .split("\n")
          .map((v) => v.trim())
          .filter(Boolean),
      },
    };
    const res: any = await CompanyApi.updateFachzubiCompany(id, payload);
    if (res?.remote === "success") {
      router.push("/fachzubi-companies");
    } else {
      alert("Failed to save company.");
    }
    setSaving(false);
  };

  return (
    <DashboardStyled>
      <MainLayout>
        <Box className="dashboardContent">
          <Box sx={{ p: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Button
                onClick={() => router.push("/fachzubi-companies")}
                sx={{ fontFamily: "Poppins", textTransform: "none", color: "#555" }}
              >
                ← Back to Companies
              </Button>
              <Typography variant="h5" sx={{ fontFamily: "Poppins", fontWeight: 600 }}>
                Edit Company (FZ)
              </Typography>
            </Stack>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
              </Box>
            ) : !company ? (
              <Typography sx={{ fontFamily: "Poppins" }}>Company not found.</Typography>
            ) : (
              <>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <SectionCard title="Basic Information">
                      <Stack spacing={2}>
                        <TextField label="Company Name" size="small" fullWidth
                          value={form.companyname} onChange={(e) => change("companyname", e.target.value)} />
                        <TextField label="Email" size="small" fullWidth
                          value={form.email} onChange={(e) => change("email", e.target.value)} />
                        <TextField label="Contact Person" size="small" fullWidth
                          value={form.contactPerson} onChange={(e) => change("contactPerson", e.target.value)} />
                        <TextField label="Phone Number" size="small" fullWidth
                          value={form.phoneNumber} onChange={(e) => change("phoneNumber", e.target.value)} />
                        <TextField label="Job Title" size="small" fullWidth
                          value={form.jobTitle} onChange={(e) => change("jobTitle", e.target.value)} />
                        <FormControlLabel
                          control={
                            <Switch color="success" checked={form.status}
                              onChange={(e) => change("status", e.target.checked)} />
                          }
                          label={form.status ? "Active" : "Inactive"}
                        />
                      </Stack>
                    </SectionCard>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <SectionCard title="Location & Category">
                      <Stack spacing={2}>
                        <TextField label="Address / Location" size="small" fullWidth
                          value={form.location} onChange={(e) => change("location", e.target.value)} />
                        <TextField label="Region" size="small" fullWidth
                          value={form.regionName} onChange={(e) => change("regionName", e.target.value)} />
                        <TextField label="Zip Code" size="small" fullWidth
                          value={form.zipCode} onChange={(e) => change("zipCode", e.target.value)} />
                        <ReadOnly label="City (linked)" value={company.city?.name} />
                        <ReadOnly label="Industry (linked)" value={company.industryName?.industryName} />
                      </Stack>
                    </SectionCard>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <SectionCard title="Web & Social">
                      <Stack spacing={2}>
                        <TextField label="Website" size="small" fullWidth
                          value={form.websiteLink} onChange={(e) => change("websiteLink", e.target.value)} />
                        <Box>
                          <Typography sx={{ fontFamily: "Poppins", fontSize: 13, color: "#555", mb: 1 }}>
                            Company Logo
                          </Typography>
                          <Stack direction="row" spacing={2} alignItems="center">
                            {form.profileIcon ? (
                              <Box component="img" src={form.profileIcon} alt="logo"
                                sx={{ width: 72, height: 72, objectFit: "cover", borderRadius: 1.5, border: "1px solid #eee" }} />
                            ) : (
                              <Box sx={{ width: 72, height: 72, borderRadius: 1.5, border: "1px dashed #ccc",
                                display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", fontSize: 12 }}>
                                No logo
                              </Box>
                            )}
                            <Button variant="outlined" component="label" disabled={uploading}
                              sx={{ textTransform: "none", fontFamily: "Poppins" }}>
                              {uploading ? "Uploading..." : "Change Logo"}
                              <input hidden type="file" accept="image/*" onChange={handleLogoUpload} />
                            </Button>
                            {form.profileIcon && (
                              <Button color="error" onClick={() => change("profileIcon", "")}
                                sx={{ textTransform: "none", fontFamily: "Poppins" }}>
                                Remove
                              </Button>
                            )}
                          </Stack>
                        </Box>
                        <TextField label="Instagram" size="small" fullWidth
                          value={form.instagram} onChange={(e) => change("instagram", e.target.value)} />
                        <TextField label="Twitter" size="small" fullWidth
                          value={form.twitter} onChange={(e) => change("twitter", e.target.value)} />
                        <TextField label="Facebook" size="small" fullWidth
                          value={form.facebook} onChange={(e) => change("facebook", e.target.value)} />
                      </Stack>
                    </SectionCard>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <SectionCard title="Media">
                      <TextField
                        label="Video Links (one per line)"
                        size="small"
                        fullWidth
                        multiline
                        minRows={4}
                        value={form.videoLink}
                        onChange={(e) => change("videoLink", e.target.value)}
                      />
                      <Box sx={{ mt: 2 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                          <Typography sx={{ fontFamily: "Poppins", fontSize: 13, color: "#555" }}>
                            Company Photos{companyImages.length ? ` (${companyImages.length})` : ""}
                          </Typography>
                          <Button variant="outlined" component="label" size="small" disabled={uploading}
                            sx={{ textTransform: "none", fontFamily: "Poppins" }}>
                            {uploading ? "Uploading..." : "Add Images"}
                            <input hidden type="file" accept="image/*" multiple onChange={handleAddImages} />
                          </Button>
                        </Stack>
                        {companyImages.length ? (
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                            {companyImages.map((img, i) => (
                              <Box key={i} sx={{ position: "relative" }}>
                                <Box component="img" src={img.file} alt={`company-${i}`}
                                  sx={{ width: 120, height: 90, objectFit: "cover", borderRadius: 1.5, border: "1px solid #eee" }} />
                                <Button onClick={() => handleRemoveImage(i)}
                                  sx={{
                                    position: "absolute", top: -8, right: -8, minWidth: 24, width: 24, height: 24,
                                    p: 0, borderRadius: "50%", backgroundColor: "#d32f2f", color: "#fff",
                                    "&:hover": { backgroundColor: "#b71c1c" },
                                  }}>
                                  ×
                                </Button>
                              </Box>
                            ))}
                          </Box>
                        ) : (
                          <Typography sx={{ fontFamily: "Poppins", color: "#999", fontSize: 14 }}>
                            No photos.
                          </Typography>
                        )}
                      </Box>
                    </SectionCard>
                  </Grid>

                  <Grid item xs={12}>
                    <SectionCard title="Description">
                      <TextField
                        label="Description"
                        size="small"
                        fullWidth
                        multiline
                        minRows={4}
                        value={form.description}
                        onChange={(e) => change("description", e.target.value)}
                      />
                    </SectionCard>
                  </Grid>

                  <Grid item xs={12}>
                    <SectionCard title="Record Info (read-only)">
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <ReadOnly label="Fachzubi ID" value={company.fachzubiId} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <ReadOnly label="Added On"
                            value={company.createdAt ? dayjs(company.createdAt).format("DD MMM YYYY, hh:mm A") : undefined} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <ReadOnly label="Last Updated"
                            value={company.updatedAt ? dayjs(company.updatedAt).format("DD MMM YYYY, hh:mm A") : undefined} />
                        </Grid>
                      </Grid>
                    </SectionCard>
                  </Grid>
                </Grid>

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 1 }}>
                  <Button onClick={() => router.push("/fachzubi-companies")} disabled={saving}
                    sx={{ textTransform: "none", fontFamily: "Poppins" }}>
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={handleSave} disabled={saving}
                    sx={{ backgroundColor: "#1A73E8", textTransform: "none", fontFamily: "Poppins", px: 4 }}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </Stack>
              </>
            )}
          </Box>
        </Box>
      </MainLayout>
    </DashboardStyled>
  );
}
