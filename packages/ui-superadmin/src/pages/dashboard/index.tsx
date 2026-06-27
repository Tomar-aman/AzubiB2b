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
  Button,
  DialogActions,
  DialogContent,
  Dialog,
} from "@mui/material";
import dayjs from "dayjs";
import DashboardStyled from "./dashboardStyled";
import TextInput from "@/components/labelInput";
import { SVG } from "@/assets/svg";
import CustomPagination from "@/components/pagination";
import Link from "next/link";
import { CompanyApi } from "../api/company/CompanyApi";

interface Company {
  _id: string;
  createdAt: string;
  companyname: string;
  email: string;
  qrCode: string;
}

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [qrOpen, setQrOpen] = useState(false);
  const [selectedQr, setSelectedQr] = useState<string>("");
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId") || "";
    setUserId(storedUserId);
    const storedRole = localStorage.getItem("role") || "";
    setRole(storedRole);
  }, []);

  const handleCompanies = async (
    page: number,
    recordPerPage: number,
    search: string,
    userId?: any,
  ) => {
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
      setTotalPages(pagination.totalPages);
    } else {
      return response?.error;
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!role) return;

    if (role === "SuperAdmin") {
      handleCompanies(page, rowsPerPage, searchValue);
    } else if (userId) {
      handleCompanies(page, rowsPerPage, searchValue, userId);
    }
  }, [page, rowsPerPage, searchValue, userId, role]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleClickOpen = (id: any) => {
    setSelectedCompanyId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    const response = await CompanyApi.deleteCompany(id);
    if (response.remote === "success") {
      setCompanies((prevCompanies) =>
        prevCompanies.filter((company) => company._id !== id),
      );
    } else {
      alert("Failed to delete the company. Please try again.");
    }
    setOpen(false);
    setLoading(false);
  };

  const handleOpenQr = (name: string, qr: string) => {
    setSelectedCompanyId(name);
    setSelectedQr(qr);
    setQrOpen(true);
  };

  const handleCloseQr = () => {
    setQrOpen(false);
  };

  const handleCopyQr = async () => {
    try {
      if (!selectedQr) return;

      // Convert base64 to Blob
      const base64 = selectedQr.split(",")[1];
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
    <DashboardStyled>
      <MainLayout>
        <Box className="dashboardContent">
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }} className="title">
              User Management
            </Typography>

            <Box className="searchTag">
              <SVG.Search className="images" />
              <TextInput
                placeholder="Search"
                className="searchBar"
                value={searchValue}
                onChange={handleSearchChange}
              />
              <Link href="/dashboard/add-new-company">
                {" "}
                <Box className="addNew">
                  <SVG.Add />
                  <span>ADD NEW</span>
                </Box>
              </Link>
            </Box>

            {/* Table */}
            {loading ? (
              <CircularProgress />
            ) : (
              <TableContainer component={Paper} className="mainTable">
                <Table sx={{ tableLayout: "fixed", width: "100%" }}>
                  <TableHead>
                    <TableRow className="tableHead">
                      <TableCell sx={{ width: "9%" }}>Id</TableCell>
                      <TableCell sx={{ width: "10%" }}>Date</TableCell>
                      <TableCell sx={{ width: "11%" }}>Company Name</TableCell>
                      <TableCell sx={{ width: "25%" }}>URL</TableCell>
                      <TableCell sx={{ width: "20%" }}>Email</TableCell>
                      <TableCell sx={{ width: "12%" }}>Qr Code</TableCell>
                      <TableCell sx={{ width: "13%" }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="tbody">
                    {companies && companies.length > 0 ? (
                      companies.map((company: Company, index: number) => (
                        <TableRow key={index}>
                          <TableCell width="20%">
                            {company._id.slice(-8)}
                          </TableCell>
                          <TableCell width="20%">
                            {dayjs(company.createdAt).format("DD/MM/YYYY")}
                          </TableCell>
                          <TableCell width="20%">
                            {company.companyname}
                          </TableCell>
                          <TableCell
                            sx={{
                              width: "25%",
                              wordBreak: "break-word",
                              whiteSpace: "normal",
                            }}
                          >
                            <Link
                              href={`${process.env.NEXT_PUBLIC_ADMIN_URL}?company=${company.companyname}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {`${process.env.NEXT_PUBLIC_ADMIN_URL}?company=${company.companyname}`}
                            </Link>
                          </TableCell>
                          <TableCell
                            sx={{
                              width: "20%",
                              wordBreak: "break-word",
                              whiteSpace: "normal",
                            }}
                          >
                            {company.email}
                          </TableCell>
                          <TableCell width="20%">
                            {company.qrCode ? (
                              <img
                                src={company.qrCode}
                                alt="QR Code"
                                width={70}
                                height={70}
                                style={{ borderRadius: "6px" }}
                                onClick={() =>
                                  handleOpenQr(
                                    company.companyname,
                                    company.qrCode,
                                  )
                                }
                              />
                            ) : (
                              "No QR"
                            )}
                          </TableCell>
                          <TableCell width="20%">
                            <Box className="settingTool">
                              <Link href={`/account-setting?id=${company._id}`}>
                                {" "}
                                <SVG.Setting />
                              </Link>
                              <Link
                                className="btnLink"
                                onClick={() => handleClickOpen(company._id)}
                                href={""}
                              >
                                <SVG.Trash
                                  onClick={() => handleClickOpen(company._id)}
                                />
                              </Link>
                              <Dialog
                                open={open}
                                className="deleteDialog"
                                onClose={handleClose}
                              >
                                <DialogContent>
                                  <Typography
                                    style={{
                                      fontWeight: 500,
                                      fontSize: "30px",
                                      lineHeight: "32px",
                                      fontFamily: "poppins",
                                      textAlign: "center",
                                      margin: "24px",
                                    }}
                                  >
                                    Are you sure you want to delete this
                                    company?
                                  </Typography>
                                </DialogContent>
                                <DialogActions className="footerButton">
                                  <Button onClick={handleClose} color="primary">
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      handleDelete(selectedCompanyId)
                                    }
                                    color="error"
                                  >
                                    Remove
                                  </Button>
                                </DialogActions>
                              </Dialog>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No companies found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Pagination */}
            <CustomPagination
              page={page}
              rowsPerPage={rowsPerPage}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
              onRowsPerPageChange={(newRows) => setRowsPerPage(newRows)}
            />
          </Box>

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
                {selectedCompanyId}
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
      </MainLayout>
    </DashboardStyled>
  );
}
export default Dashboard;
