import { JobApi } from "@/pages/api/jobs/jobApi";
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function JobDetails() {
  const [loading, setLoading] = useState(false);
  const [jobData, setJobData] = useState<any>({});
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const router = useRouter();
  const { jobId }: any = router.query;

  const handleGetJob = async (jobId: string) => {
    try {
      setLoading(true);
      const response = await JobApi.getJobById(jobId);
      if (response.remote === "success") {
        setJobData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching job data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) handleGetJob(jobId);
  }, [jobId]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h5" fontWeight={600}>
              {jobData.jobTitle || "-"}
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push(`/manage-jobs/add-job?id=${jobId}`)}
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              Edit Job
            </Button>
          </Box>

          <Typography variant="body1" color="#555" mt={0.5}>
            {jobData.companyName || "-"}
          </Typography>

          <Typography variant="body2" color="#777" mt={0.5}>
            {jobData.industryName || "-"}
          </Typography>

          <Typography variant="body2" mt={1} color="#666">
            {jobData.address}
          </Typography>

          <Typography variant="body2" mt={1} color="#666">
            📍 {jobData.cityNames}
          </Typography>

          {/* EMAIL BUTTON */}
          {jobData.email && (
            <Button
              variant="outlined"
              sx={{ mt: 2, textTransform: "none", borderRadius: 2 }}
              onClick={() =>
                (window.location.href = `mailto:${jobData.email}?subject=Job Inquiry - ${jobData.jobTitle}`)
              }
            >
              Inquiry via email
            </Button>
          )}

          {/* MAIN */}
          <Grid container spacing={3} mt={2}>
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                {jobData?.jobImages?.length > 0 ? (
                  jobData.jobImages.map((img: any, index: number) => (
                    <Grid item xs={4} key={index}>
                      <Box
                        component="img"
                        src={`${baseURL}/${img.file}`}
                        sx={{
                          width: "100%",
                          height: 120,
                          objectFit: "cover",
                          borderRadius: 2,
                        }}
                      />
                    </Grid>
                  ))
                ) : (
                  <Typography>No Images</Typography>
                )}
              </Grid>

              {/* DESCRIPTION */}
              <Box mt={3}>
                <Typography fontWeight={600} mb={1}>
                  Job Description
                </Typography>

                <Box
                  sx={{ color: "#444", fontSize: 14, lineHeight: 1.6 }}
                  dangerouslySetInnerHTML={{
                    __html: jobData.jobDescription || "",
                  }}
                />
              </Box>

              {/* ATTACHMENTS */}
              {jobData?.attachement?.length > 0 && (
                <Box mt={3}>
                  <Typography fontWeight={600}>Attachments</Typography>

                  {jobData.attachement.map((file: any, index: number) => (
                    <Grid item xs={4} key={index}>
                      <Box
                        component="img"
                        src={`${baseURL}/${file.file}`}
                        sx={{
                          width: "100%",
                          height: 120,
                          objectFit: "cover",
                          borderRadius: 2,
                        }}
                      />
                    </Grid>
                  ))}
                </Box>
              )}

              {jobData.videoLink && (
                <Box mt={3}>
                  <Typography fontWeight={600}>Video</Typography>

                  <Box mt={1}>
                    {jobData.videoLink.includes("youtube") ? (
                      <iframe
                        width="100%"
                        height="300"
                        src={jobData.videoLink.replace("watch?v=", "embed/")}
                        style={{ borderRadius: 8 }}
                        allowFullScreen
                      />
                    ) : (
                      <video width="100%" controls>
                        <source src={jobData.videoLink} />
                      </video>
                    )}
                  </Box>
                </Box>
              )}

              {/* Map */}
              {/* {jobData.mapUrl && (
                <iframe
                  src={jobData.mapUrl}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                />
              )} */}

              {/* Open in Google Maps */}
              {jobData.locationUrl && (
                <Box mt={3}>
                  <Typography fontWeight={600}>Location URL : </Typography>
                  <Button
                    onClick={() => window.open(jobData.locationUrl, "_blank")}
                  >
                    Open in Google Maps
                  </Button>
                </Box>
              )}

              {/* {jobData.embeddedCode && (
                <Box mt={3}>
                  <Typography fontWeight={600}>Embedded Code</Typography>

                  <Box
                    mt={1}
                    dangerouslySetInnerHTML={{
                      __html: jobData.embeddedCode,
                    }}
                  />
                </Box>
              )} */}
              {jobData.embeddedCode && (
                <Box mt={3}>
                  <Typography fontWeight={600}>Embedded Code</Typography>

                  <Box mt={1}>
                    {jobData.embeddedCode.includes("youtube") ? (
                      <iframe
                        width="100%"
                        height="300"
                        src={jobData.embeddedCode.replace("watch?v=", "embed/")}
                        style={{ borderRadius: 8 }}
                        allowFullScreen
                      />
                    ) : (
                      <video width="100%" controls>
                        <source src={jobData.embeddedCode} />
                      </video>
                    )}
                  </Box>
                </Box>
              )}

              {jobData?.additionalData?.length > 0 && (
                <Box mt={3}>
                  <Typography fontWeight={600}>
                    Additional Information
                  </Typography>

                  <Grid container spacing={2} mt={1}>
                    {jobData.additionalData.map((item: any, index: number) => (
                      <Grid item xs={6} key={index}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            border: "1px solid #eee",
                            borderRadius: 2,
                            p: 1,
                          }}
                        >
                          <img
                            src={`${baseURL}${item.file}`}
                            alt="icon"
                            width={24}
                            height={24}
                          />
                          <Typography fontSize={14}>{item.text}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Grid>

            {/* RIGHT */}
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Info label="Phone" value={jobData.phoneNumber || "-"} />
                  <Info label="Email" value={jobData.email || "-"} />
                  {jobData.additionalEmail && (
                    <Info label="Alt Email" value={jobData.additionalEmail} />
                  )}
                  <Info label="Job Type" value={jobData.jobTypeName || "-"} />
                  <Info label="Industry" value={jobData.industryName || "-"} />
                  <Info
                    label="Location"
                    value={jobData.locationField}
                  />

                  {/* WEBSITE */}
                  {jobData.urlLink && (
                    <Box
                      mt={2}
                      sx={{
                        border: "1px solid #1976d2",
                        borderRadius: 2,
                        p: 1,
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                      onClick={() => window.open(jobData.urlLink, "_blank")}
                    >
                      <Typography
                        sx={{
                          fontSize: 13,
                          color: "#1976d2",
                          wordBreak: "break-all",
                        }}
                      >
                        {jobData.urlLink}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
}

/* INFO ROW */
const Info = ({ label, value }: any) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      mb: 1,
    }}
  >
    <Typography color="#777">{label}</Typography>
    <Typography fontWeight={500}>{value}</Typography>
  </Box>
);
