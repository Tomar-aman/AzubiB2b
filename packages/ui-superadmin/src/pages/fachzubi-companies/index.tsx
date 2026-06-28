import MainLayout from "@/components/layout";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  Switch,
  Dialog,
  Button,
} from "@mui/material";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import DashboardStyled from "../dashboard/dashboardStyled";
import TextInput from "@/components/labelInput";
import { SVG } from "@/assets/svg";
import CustomPagination from "@/components/pagination";
import { CompanyApi } from "../api/company/CompanyApi";

interface FachzubiCompany {
  _id: string;
  createdAt: string;
  companyname: string;
  email: string;
  phoneNumber: string;
  location: string;
  description: string;
  websiteLink: string;
  contactPerson: string;
  status: boolean;
  fachzubiId: string;
  qrCode?: string;
}

function FachzubiCompanies() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<FachzubiCompany[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [selectedQr, setSelectedQr] = useState("");
  const [selectedName, setSelectedName] = useState("");

  const fetchCompanies = async (p: number, rpp: number) => {
    setLoading(true);
    const response: any = await CompanyApi.getFachzubiCompanies({ page: p, recordPerPage: rpp });
    if (response?.remote === "success") {
      setCompanies(response.data?.companies ?? []);
      setTotalPages(response.data?.pagination?.totalPages ?? 1);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleToggleStatus = async (company: FachzubiCompany) => {
    setTogglingId(company._id);
    const res: any = await CompanyApi.toggleFachzubiCompanyStatus(company._id);
    if (res?.remote === "success") {
      setCompanies((prev) =>
        prev.map((c) => (c._id === company._id ? { ...c, status: res.data.status } : c))
      );
    }
    setTogglingId(null);
  };

  const handleOpenQr = (name: string, qr: string) => {
    setSelectedName(name);
    setSelectedQr(qr);
    setQrOpen(true);
  };

  const handleCopyQr = async () => {
    try {
      if (!selectedQr) return;
      const base64 = selectedQr.split(",")[1];
      const byteNumbers = atob(base64)
        .split("")
        .map((c) => c.charCodeAt(0));
      const blob = new Blob([new Uint8Array(byteNumbers)], { type: "image/png" });
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      alert("Copied!");
    } catch (error) {
      console.error("Failed to copy QR image:", error);
    }
  };

  const handleDownloadQr = () => {
    if (!selectedQr) return;
    const a = document.createElement("a");
    a.href = selectedQr;
    a.download = `${selectedName || "company"}-qr.png`;
    a.click();
  };

  const filtered = companies.filter(
    (c) =>
      c.companyname?.toLowerCase().includes(searchValue.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchValue.toLowerCase()),
  );

  return (
    <DashboardStyled>
      <MainLayout>
        <Box className="dashboardContent">
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }} className="title">
              Manage Companies (Fachzubi)
            </Typography>

            <Box className="searchTag">
              <SVG.Search className="images" />
              <TextInput
                placeholder="Search by name or email"
                className="searchBar"
                value={searchValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchValue(e.target.value)
                }
              />
            </Box>

            {loading ? (
              <CircularProgress />
            ) : (
              <TableContainer component={Paper} className="mainTable">
                <Table sx={{ tableLayout: "fixed", width: "100%" }}>
                  <TableHead>
                    <TableRow className="tableHead">
                      <TableCell sx={{ width: "6%" }}>ID</TableCell>
                      <TableCell sx={{ width: "10%" }}>Date</TableCell>
                      <TableCell sx={{ width: "16%" }}>Company Name</TableCell>
                      <TableCell sx={{ width: "17%" }}>Email</TableCell>
                      <TableCell sx={{ width: "12%" }}>Phone</TableCell>
                      <TableCell sx={{ width: "10%" }}>Status</TableCell>
                      <TableCell sx={{ width: "8%" }}>Active</TableCell>
                      <TableCell sx={{ width: "11%" }}>Qr Code</TableCell>
                      <TableCell sx={{ width: "8%" }}>View</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="tbody">
                    {filtered.length > 0 ? (
                      filtered.map((company, index) => (
                        <TableRow key={index}>
                          <TableCell>{company._id?.slice(-6)}</TableCell>
                          <TableCell>
                            {dayjs(company.createdAt).format("DD/MM/YYYY")}
                          </TableCell>
                          <TableCell sx={{ wordBreak: "break-word", whiteSpace: "normal" }}>
                            {company.companyname}
                          </TableCell>
                          <TableCell sx={{ wordBreak: "break-word", whiteSpace: "normal" }}>
                            {company.email}
                          </TableCell>
                          <TableCell>{company.phoneNumber || "—"}</TableCell>
                          <TableCell>
                            <Chip
                              label={company.status ? "Active" : "Inactive"}
                              size="small"
                              sx={{
                                background: company.status ? "#e6f4ea" : "#fce8e6",
                                color: company.status ? "#1e7e34" : "#c5221f",
                                fontFamily: "Poppins",
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Tooltip title={company.status ? "Set Inactive" : "Set Active"}>
                              <Switch
                                checked={company.status}
                                disabled={togglingId === company._id}
                                onChange={() => handleToggleStatus(company)}
                                size="small"
                                color="success"
                              />
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            {company.qrCode ? (
                              <img
                                src={company.qrCode}
                                alt="QR Code"
                                width={48}
                                height={48}
                                style={{ borderRadius: "6px", cursor: "pointer" }}
                                onClick={() =>
                                  handleOpenQr(company.companyname, company.qrCode as string)
                                }
                              />
                            ) : (
                              "No QR"
                            )}
                          </TableCell>
                          <TableCell>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  router.push(`/fachzubi-companies/details?id=${company._id}`)
                                }
                                sx={{ color: "#1976d2" }}
                              >
                                <SVG.Eye />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} align="center">
                          No Fachzubi companies found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            <CustomPagination
              page={page}
              rowsPerPage={rowsPerPage}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
              onRowsPerPageChange={(newRows) => setRowsPerPage(newRows)}
            />
          </Box>
        </Box>

        <Dialog
          open={qrOpen}
          onClose={() => setQrOpen(false)}
          PaperProps={{
            style: {
              borderRadius: "20px",
              padding: 0,
              overflow: "hidden",
              boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
            },
          }}
        >
          <Box sx={{ background: "#fff", p: "32px 32px 24px", textAlign: "center", width: 340 }}>
            <Typography sx={{ fontSize: 20, fontWeight: 600, fontFamily: "Poppins" }}>
              {selectedName}
            </Typography>
            <Box
              sx={{
                background: "#fff",
                p: "20px",
                mt: 1,
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {selectedQr ? (
                <img src={selectedQr} alt="QR Code" width={230} height={230} style={{ display: "block" }} />
              ) : null}
            </Box>
            <Typography sx={{ mt: "20px", fontSize: 16, fontWeight: 600, color: "#202124", fontFamily: "Poppins" }}>
              Scan to Open Company App
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5, mt: "22px" }}>
              <Button
                onClick={handleCopyQr}
                variant="outlined"
                fullWidth
                sx={{ borderRadius: "10px", p: "10px", fontSize: 15, textTransform: "none", fontFamily: "Poppins" }}
              >
                Copy
              </Button>
              <Button
                onClick={handleDownloadQr}
                variant="contained"
                fullWidth
                sx={{ backgroundColor: "#1A73E8", borderRadius: "10px", p: "10px", fontSize: 15, textTransform: "none", fontFamily: "Poppins" }}
              >
                Download
              </Button>
            </Box>
          </Box>
        </Dialog>
      </MainLayout>
    </DashboardStyled>
  );
}

export default FachzubiCompanies;
