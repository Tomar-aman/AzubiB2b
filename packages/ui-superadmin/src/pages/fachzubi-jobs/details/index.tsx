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
  Divider,
  Switch,
  Link as MuiLink,
} from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import DashboardStyled from "../../dashboard/dashboardStyled";
import { CompanyApi } from "../../api/company/CompanyApi";

interface FachzubiJobMeta {
  zipCode?: string;
  videoLink?: string[];
  companyName?: string;
  cityNames?: string[];
  industryName?: string;
  regionName?: string;
  additionalEmail?: string;
}

interface JobDetail {
  _id: string;
  jobTitle?: string;
  email?: string;
  additionalEmail?: string;
  address?: string;
  locationField?: string;
  jobDescription?: string;
  videoLink?: string;
  startDate?: string;
  status?: boolean;
  fachzubiId?: string;
  fachzubiMeta?: FachzubiJobMeta;
  companyId?: { companyname?: string; email?: string; profileIcon?: string } | null;
  city?: { name?: string }[];
  industryName?: { industryName?: string } | null;
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

export default function FachzubiJobDetails() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<JobDetail | null>(null);
  const [toggling, setToggling] = useState(false);

  const fetchJob = async (jobId: string) => {
    setLoading(true);
    const res: any = await CompanyApi.getFachzubiJob(jobId);
    if (res?.remote === "success" && res.data) {
      setJob(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (id) fetchJob(id);
  }, [id]);

  const handleToggle = async () => {
    if (!job) return;
    setToggling(true);
    const res: any = await CompanyApi.toggleFachzubiJobStatus(job._id);
    if (res?.remote === "success") {
      setJob((prev) => (prev ? { ...prev, status: res.data.status } : prev));
    }
    setToggling(false);
  };

  const meta = job?.fachzubiMeta ?? {};
  const videoLinks = Array.isArray(meta.videoLink) ? meta.videoLink : [];
  // Prefer the real linked City records, fall back to the meta snapshot.
  const cityNames =
    Array.isArray(job?.city) && job!.city.length
      ? job!.city.map((c) => c?.name).filter(Boolean)
      : Array.isArray(meta.cityNames)
        ? meta.cityNames
        : [];
  const industryName = job?.industryName?.industryName || meta.industryName || "";

  return (
    <DashboardStyled>
      <MainLayout>
        <Box className="dashboardContent">
          <Box sx={{ p: 4 }}>
            <Button
              onClick={() => router.push("/fachzubi-jobs")}
              sx={{ fontFamily: "Poppins", textTransform: "none", mb: 2, color: "#555" }}
            >
              ← Back to Jobs
            </Button>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
              </Box>
            ) : !job ? (
              <Typography sx={{ fontFamily: "Poppins" }}>Job not found.</Typography>
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
                  <Box sx={{ flex: 1, minWidth: 200 }}>
                    <Typography sx={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 24 }}>
                      {job.jobTitle || "—"}
                    </Typography>
                    <Typography sx={{ fontFamily: "Poppins", color: "#777", fontSize: 14 }}>
                      {job.companyId?.companyname || meta.companyName || "No company"}
                      {cityNames.length ? ` · ${cityNames.join(", ")}` : ""}
                    </Typography>
                    <Chip
                      label={job.status ? "Active" : "Inactive"}
                      size="small"
                      sx={{
                        mt: 1,
                        background: job.status ? "#e6f4ea" : "#fce8e6",
                        color: job.status ? "#1e7e34" : "#c5221f",
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
                      checked={Boolean(job.status)}
                      disabled={toggling}
                      onChange={handleToggle}
                      color="success"
                    />
                  </Box>
                </Paper>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <SectionCard title="Job Information">
                      <Field label="Job Title" value={job.jobTitle} />
                      <Field label="Company" value={job.companyId?.companyname || meta.companyName} />
                      <Field label="Industry" value={industryName} />
                      <Field
                        label="Start Date"
                        value={job.startDate ? dayjs(job.startDate).format("DD MMM YYYY") : undefined}
                      />
                    </SectionCard>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <SectionCard title="Contact & Location">
                      <Field label="Email" value={job.email} />
                      <Field label="Additional Email" value={job.additionalEmail || meta.additionalEmail} />
                      <Field label="Address" value={job.address} />
                      <Field label="City" value={cityNames.join(", ")} />
                      <Field label="Region" value={meta.regionName} />
                      <Field label="Zip Code" value={meta.zipCode} />
                    </SectionCard>
                  </Grid>

                  <Grid item xs={12}>
                    <SectionCard title="Description">
                      <Box
                        sx={{ fontFamily: "Poppins", fontSize: 15, color: "#333" }}
                        dangerouslySetInnerHTML={{ __html: job.jobDescription || "—" }}
                      />
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
                    <SectionCard title="Record Info">
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Field label="Fachzubi ID" value={job.fachzubiId} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Field
                            label="Added On"
                            value={job.createdAt ? dayjs(job.createdAt).format("DD MMM YYYY, hh:mm A") : undefined}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Field
                            label="Last Updated"
                            value={job.updatedAt ? dayjs(job.updatedAt).format("DD MMM YYYY, hh:mm A") : undefined}
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
