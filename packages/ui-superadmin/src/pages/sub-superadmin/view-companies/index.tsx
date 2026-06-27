import { useEffect, useState } from "react";
import {
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
import { CompanyApi } from "@/pages/api/company/CompanyApi";
import { useRouter } from "next/router";

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

export default function CompanyBoard() {
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const router = useRouter();
  const { userId } = router.query;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleCompanies = async (
    page: number,
    recordPerPage: number,
    search: string,
    userId: any,
  ) => {
    try {
      setLoading(true);
      const response: any = await CompanyApi.getAllCompanies({
        page,
        recordPerPage,
        search,
        userId,
      });

      const pagination = response?.data?.data?.pagination;
      const companies = response?.data?.data?.companies;

      if (response?.remote === "success") {
        setCompanies(companies);
        setTotalPages(pagination?.totalPages);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;

    if (userId) {
      handleCompanies(page, rowsPerPage, searchValue, userId);
    }
  }, [router.isReady, page, rowsPerPage, searchValue, userId]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" fontWeight={500} mb={2}>
          Companies
        </Typography>

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
                <InputAdornment position="start">🔍</InputAdornment>
              ),
            }}
          />
        </Box>

        <Grid container spacing={3}>
          {companies.map((company: any) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={company._id} sx={{ display: "flex" }}>
              <Card
                onClick={() =>
                  router.push(
                    `/sub-superadmin/company-jobs?companyId=${company._id}`
                  )
                }
                sx={{
                  cursor: "pointer",
                  p: 2.5,
                  borderRadius: 4,
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  {/* Logo */}
                  <Box
                    sx={{
                      height: 80,
                      width: 80,
                      mx: "auto",
                      mb: 2,
                      borderRadius: "50%",
                      backgroundColor: "#f4f6f8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={
                        company.profileIcon
                          ? `${baseURL}/${company.profileIcon}`
                          : "/no-image.png"
                      }
                      alt="company logo"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>

                  {/* Company Name */}
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {company.companyname}
                  </Typography>

                  {/* Email */}
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {company.email}
                  </Typography>

                  {/* Location */}
                  {company.location && (
                    <Typography variant="caption" color="text.secondary">
                      📍 {company.location}
                    </Typography>
                  )}

                  <Box mt={2}>
                    <a
                      href={`${process.env.NEXT_PUBLIC_ADMIN_URL}?company=${company.companyname}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: "none",
                        fontSize: "12px",
                        color: "#1976d2",
                        fontWeight: 500,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Visit Website →
                    </a>
                  </Box>

                  <Box mt={2}>
                    <Box
                      sx={{
                        display: "inline-block",
                        px: 2,
                        py: 0.5,
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: 600,
                        backgroundColor: company.status
                          ? "#e8f5e9"
                          : "#ffebee",
                        color: company.status ? "#2e7d32" : "#d32f2f",
                      }}
                    >
                      {company.status ? "Active" : "Inactive"}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {!loading && companies.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 10,
              color: "#999",
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              No companies found
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
