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
  Link as MuiLink,
} from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import DashboardStyled from "../../dashboard/dashboardStyled";
import { CompanyApi } from "../../api/company/CompanyApi";

interface JobMeta {
  zipCode?: string;
  videoLink?: string[];
  companyName?: string;
  cityNames?: string[];
  industryName?: string;
  regionName?: string;
  additionalEmail?: string;
  attachments?: Array<{ file?: string; fileName?: string }>;
}

interface JobDetail {
  _id: string;
  jobTitle?: string;
  email?: string;
  additionalEmail?: string;
  address?: string;
  phoneNumber?: string;
  jobDescription?: string;
  startDate?: string;
  status?: boolean;
  fachzubiId?: string;
  fachzubiMeta?: JobMeta;
  companyId?: { companyname?: string; email?: string } | null;
  city?: { name?: string }[];
  industryName?: { industryName?: string } | null;
  jobImages?: { file?: string }[];
  attachement?: { file?: string }[];
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

export default function FachzubiJobEdit() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [job, setJob] = useState<JobDetail | null>(null);
  const [jobImages, setJobImages] = useState<{ file: string }[]>([]);
  const [attachments, setAttachments] = useState<{ file: string; fileName?: string }[]>([]);

  const [form, setForm] = useState({
    jobTitle: "",
    email: "",
    additionalEmail: "",
    address: "",
    phoneNumber: "",
    jobDescription: "",
    startDate: "",
    status: true,
    // meta
    companyName: "",
    industryName: "",
    regionName: "",
    zipCode: "",
    cityNames: "", // newline-separated
    videoLink: "", // newline-separated
  });

  const fetchJob = async (jobId: string) => {
    setLoading(true);
    const res: any = await CompanyApi.getFachzubiJob(jobId);
    if (res?.remote === "success" && res.data) {
      const j: JobDetail = res.data;
      const meta = j.fachzubiMeta ?? {};
      const cityNames =
        Array.isArray(j.city) && j.city.length
          ? j.city.map((c) => c?.name).filter(Boolean)
          : Array.isArray(meta.cityNames)
            ? meta.cityNames
            : [];
      setJob(j);
      setJobImages(
        (Array.isArray(j.jobImages) ? j.jobImages : [])
          .filter((x) => x?.file)
          .map((x) => ({ file: x.file as string })),
      );
      const metaAtt =
        Array.isArray(meta.attachments) && meta.attachments.length
          ? meta.attachments
          : (Array.isArray(j.attachement) ? j.attachement : []).map((a) => ({ file: a?.file }));
      setAttachments(
        metaAtt
          .filter((a) => a?.file)
          .map((a) => ({ file: a.file as string, fileName: (a as { fileName?: string }).fileName })),
      );
      setForm({
        jobTitle: j.jobTitle ?? "",
        email: j.email ?? "",
        additionalEmail: j.additionalEmail ?? meta.additionalEmail ?? "",
        address: j.address ?? "",
        phoneNumber: j.phoneNumber ?? "",
        jobDescription: j.jobDescription ?? "",
        startDate: j.startDate ? dayjs(j.startDate).format("YYYY-MM-DD") : "",
        status: Boolean(j.status),
        companyName: j.companyId?.companyname ?? meta.companyName ?? "",
        industryName: j.industryName?.industryName ?? meta.industryName ?? "",
        regionName: meta.regionName ?? "",
        zipCode: meta.zipCode ?? "",
        cityNames: (cityNames as string[]).join("\n"),
        videoLink: Array.isArray(meta.videoLink) ? meta.videoLink.join("\n") : "",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (id) fetchJob(id);
  }, [id]);

  const change = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toLines = (v: string) =>
    v
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    const payload = {
      jobTitle: form.jobTitle,
      email: form.email,
      additionalEmail: form.additionalEmail,
      address: form.address,
      phoneNumber: form.phoneNumber,
      jobDescription: form.jobDescription,
      startDate: form.startDate,
      status: form.status,
      jobImages,
      attachement: attachments.map((a) => ({ file: a.file })),
      fachzubiMeta: {
        companyName: form.companyName,
        industryName: form.industryName,
        regionName: form.regionName,
        zipCode: form.zipCode,
        additionalEmail: form.additionalEmail,
        cityNames: toLines(form.cityNames),
        videoLink: toLines(form.videoLink),
        attachments,
      },
    };
    const res: any = await CompanyApi.updateFachzubiJob(id, payload);
    if (res?.remote === "success") {
      router.push("/fachzubi-jobs");
    } else {
      alert("Failed to save job.");
    }
    setSaving(false);
  };

  const handleAddJobImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    e.target.value = "";
    if (!files.length) return;
    setUploading(true);
    const res: any = await CompanyApi.uploadFachzubiFiles(files, "image");
    if (res?.remote === "success" && Array.isArray(res.data?.files)) {
      setJobImages((prev) => [...prev, ...res.data.files.map((f: any) => ({ file: f.file }))]);
    } else {
      alert("Failed to upload images.");
    }
    setUploading(false);
  };

  const handleRemoveJobImage = (index: number) => {
    setJobImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddDocuments = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    e.target.value = "";
    if (!files.length) return;
    setUploading(true);
    const res: any = await CompanyApi.uploadFachzubiFiles(files, "document");
    if (res?.remote === "success" && Array.isArray(res.data?.files)) {
      setAttachments((prev) => [
        ...prev,
        ...res.data.files.map((f: any) => ({ file: f.file, fileName: f.fileName })),
      ]);
    } else {
      alert("Failed to upload documents.");
    }
    setUploading(false);
  };

  const handleRemoveDocument = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <DashboardStyled>
      <MainLayout>
        <Box className="dashboardContent">
          <Box sx={{ p: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Button
                onClick={() => router.push("/fachzubi-jobs")}
                sx={{ fontFamily: "Poppins", textTransform: "none", color: "#555" }}
              >
                ← Back to Jobs
              </Button>
              <Typography variant="h5" sx={{ fontFamily: "Poppins", fontWeight: 600 }}>
                Edit Job (FZ)
              </Typography>
            </Stack>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
              </Box>
            ) : !job ? (
              <Typography sx={{ fontFamily: "Poppins" }}>Job not found.</Typography>
            ) : (
              <>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <SectionCard title="Job Information">
                      <Stack spacing={2}>
                        <TextField label="Job Title" size="small" fullWidth
                          value={form.jobTitle} onChange={(e) => change("jobTitle", e.target.value)} />
                        <TextField label="Company Name" size="small" fullWidth
                          value={form.companyName} onChange={(e) => change("companyName", e.target.value)} />
                        <TextField label="Industry" size="small" fullWidth
                          value={form.industryName} onChange={(e) => change("industryName", e.target.value)} />
                        <TextField label="Start Date" type="date" size="small" fullWidth
                          InputLabelProps={{ shrink: true }}
                          value={form.startDate} onChange={(e) => change("startDate", e.target.value)} />
                        <FormControlLabel
                          control={
                            <Switch color="success" checked={form.status}
                              onChange={(e) => change("status", e.target.checked)} />
                          }
                          label={form.status ? "Active" : "Inactive"}
                        />
                        <ReadOnly label="Linked Company" value={job.companyId?.companyname} />
                      </Stack>
                    </SectionCard>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <SectionCard title="Contact & Location">
                      <Stack spacing={2}>
                        <TextField label="Email" size="small" fullWidth
                          value={form.email} onChange={(e) => change("email", e.target.value)} />
                        <TextField label="Additional Email" size="small" fullWidth
                          value={form.additionalEmail} onChange={(e) => change("additionalEmail", e.target.value)} />
                        <TextField label="Phone Number" size="small" fullWidth
                          value={form.phoneNumber} onChange={(e) => change("phoneNumber", e.target.value)} />
                        <TextField label="Address" size="small" fullWidth
                          value={form.address} onChange={(e) => change("address", e.target.value)} />
                        <TextField label="Region" size="small" fullWidth
                          value={form.regionName} onChange={(e) => change("regionName", e.target.value)} />
                        <TextField label="Zip Code" size="small" fullWidth
                          value={form.zipCode} onChange={(e) => change("zipCode", e.target.value)} />
                        <TextField label="Cities (one per line)" size="small" fullWidth multiline minRows={2}
                          value={form.cityNames} onChange={(e) => change("cityNames", e.target.value)} />
                      </Stack>
                    </SectionCard>
                  </Grid>

                  <Grid item xs={12}>
                    <SectionCard title="Description">
                      <TextField label="Job Description" size="small" fullWidth multiline minRows={5}
                        value={form.jobDescription} onChange={(e) => change("jobDescription", e.target.value)} />
                    </SectionCard>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <SectionCard title="Media">
                      <TextField label="Video Links (one per line)" size="small" fullWidth multiline minRows={4}
                        value={form.videoLink} onChange={(e) => change("videoLink", e.target.value)} />
                      <Box sx={{ mt: 2 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                          <Typography sx={{ fontFamily: "Poppins", fontSize: 13, color: "#555" }}>
                            Job Images{jobImages.length ? ` (${jobImages.length})` : ""}
                          </Typography>
                          <Button variant="outlined" component="label" size="small" disabled={uploading}
                            sx={{ textTransform: "none", fontFamily: "Poppins" }}>
                            {uploading ? "Uploading..." : "Add Images"}
                            <input hidden type="file" accept="image/*" multiple onChange={handleAddJobImages} />
                          </Button>
                        </Stack>
                        {jobImages.length ? (
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                            {jobImages.map((img, i) => (
                              <Box key={i} sx={{ position: "relative" }}>
                                <Box component="img" src={img.file} alt={`job-${i}`}
                                  sx={{ width: 120, height: 90, objectFit: "cover", borderRadius: 1.5, border: "1px solid #eee" }} />
                                <Button onClick={() => handleRemoveJobImage(i)}
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
                          <Typography sx={{ fontFamily: "Poppins", color: "#999", fontSize: 14 }}>No images.</Typography>
                        )}
                      </Box>
                    </SectionCard>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <SectionCard title="Documents">
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                        <Typography sx={{ fontFamily: "Poppins", fontSize: 13, color: "#555" }}>
                          Attachments{attachments.length ? ` (${attachments.length})` : ""}
                        </Typography>
                        <Button variant="outlined" component="label" size="small" disabled={uploading}
                          sx={{ textTransform: "none", fontFamily: "Poppins" }}>
                          {uploading ? "Uploading..." : "Add Documents"}
                          <input hidden type="file" multiple onChange={handleAddDocuments} />
                        </Button>
                      </Stack>
                      {attachments.length ? (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          {attachments.map((a, i) => (
                            <Stack key={i} direction="row" alignItems="center" justifyContent="space-between"
                              sx={{ border: "1px solid #eee", borderRadius: 1, px: 1.5, py: 0.75 }}>
                              <MuiLink href={a.file} target="_blank" rel="noreferrer"
                                sx={{ wordBreak: "break-all", fontFamily: "Poppins", fontSize: 14 }}>
                                {a.fileName || a.file}
                              </MuiLink>
                              <Button color="error" onClick={() => handleRemoveDocument(i)}
                                sx={{ textTransform: "none", fontFamily: "Poppins", minWidth: 0 }}>
                                Remove
                              </Button>
                            </Stack>
                          ))}
                        </Box>
                      ) : (
                        <Typography sx={{ fontFamily: "Poppins", color: "#999" }}>No attachments.</Typography>
                      )}
                    </SectionCard>
                  </Grid>

                  <Grid item xs={12}>
                    <SectionCard title="Record Info (read-only)">
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <ReadOnly label="Fachzubi ID" value={job.fachzubiId} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <ReadOnly label="Added On"
                            value={job.createdAt ? dayjs(job.createdAt).format("DD MMM YYYY, hh:mm A") : undefined} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <ReadOnly label="Last Updated"
                            value={job.updatedAt ? dayjs(job.updatedAt).format("DD MMM YYYY, hh:mm A") : undefined} />
                        </Grid>
                      </Grid>
                    </SectionCard>
                  </Grid>
                </Grid>

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 1 }}>
                  <Button onClick={() => router.push("/fachzubi-jobs")} disabled={saving}
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
