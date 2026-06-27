import { useEffect, useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    TextField,
    Grid,
    Card,
    CardContent,
    Box,
    Link,
    InputAdornment,
    Container,
    ThemeProvider,
    createTheme,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { useRouter } from "next/router";
import { JobApi } from "@/pages/api/jobs/jobApi";

const theme = createTheme({
    palette: {
        background: { default: "#f9f9f9", paper: "#ffffff" },
        text: { primary: "#1a1a1a", secondary: "#666" },
    },
    typography: {
        fontFamily: "'Segoe UI', Arial, sans-serif",
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    border: "0.5px solid #e0e0e0",
                    boxShadow: "none",
                    transition: "border-color 0.15s",
                    "&:hover": { borderColor: "#aaa" },
                },
            },
        },
    },
});

export default function JobBoard() {
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState<any>([]);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

    const router = useRouter();
    const { companyId } = router.query;

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handleJobs = async (
        page: number,
        recordPerPage: number,
        search: string,
        companyId: any,
    ) => {
        setLoading(true);
        const response: any = await JobApi.getAllJob(
            page,
            recordPerPage,
            search,
            companyId,
        );

        if (response?.remote === "success") {
            setJobs(response.data.data);
        } else {
            return response?.error;
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!router.isReady) return;

        if (companyId) {
            handleJobs(page, rowsPerPage, searchValue, companyId);
        }
    }, [router.isReady, page, rowsPerPage, searchValue, companyId]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h5" fontWeight={500} mb={2}>Jobs</Typography>

                <Box sx={{ mb: 3, position: "relative" }}>
                    <TextField
                        fullWidth
                        placeholder="Search companies..."
                        value={searchValue}
                        onChange={handleSearchChange}
                        sx={{
                            background: "#fff",
                            borderRadius: 2,
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    🔍
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                <Grid container spacing={3}>
                    {jobs.map((job: any) => (
                        <Grid item xs={12} sm={6} md={4} key={job._id}>
                            <Card
                                sx={{
                                    height: "100%",
                                    p: 2,
                                    borderRadius: 3,
                                    transition: "0.3s",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                                    "&:hover": {
                                        transform: "translateY(-6px)",
                                        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                                    },
                                }}
                            >
                                <CardContent sx={{ p: 0 }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 600,
                                            mb: 1,
                                            textAlign: "left",
                                        }}
                                    >
                                        {job.jobTitle}
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                            mb: 1,
                                            color: "#555",
                                        }}
                                    >
                                        <Typography variant="body2">
                                            {job.industryName || "Industry"}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                            mb: 1,
                                            color: "#777",
                                        }}
                                    >
                                        <Typography variant="body2">
                                            {job.concatenatedCities || "No location"}
                                        </Typography>
                                    </Box>

                                    {/* Description (Trimmed) */}
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "#666",
                                            fontSize: 13,
                                            mb: 2,
                                            display: "-webkit-box",
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: job.jobDescription || "",
                                        }}
                                    />

                                    {/* Status */}
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: 10,
                                                backgroundColor: job.status ? "#e6f7ee" : "#fdecea",
                                                color: job.status ? "#2e7d32" : "#c62828",
                                                fontWeight: 500,
                                            }}
                                        >
                                            {job.status ? "Active" : "Inactive"}
                                        </Typography>

                                        {/* Optional View Button */}
                                        <Typography
                                            sx={{
                                                fontSize: 13,
                                                color: "#1976d2",
                                                cursor: "pointer",
                                                fontWeight: 500,
                                            }}
                                            onClick={() =>
                                                router.push(`/sub-superadmin/job-details?jobId=${job._id}`)
                                            }
                                        >
                                            View →
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {!loading && jobs.length === 0 && (
                    <Box
                        sx={{
                            textAlign: "center",
                            py: 10,
                            color: "#999",
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            No jobs found
                        </Typography>
                        <Typography variant="body2">
                            Try adjusting your search or check back later.
                        </Typography>
                    </Box>
                )}
            </Container>
        </ThemeProvider>
    );
}