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
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Button,
} from "@mui/material";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import DashboardStyled from "../dashboard/dashboardStyled";
import TextInput from "@/components/labelInput";
import { SVG } from "@/assets/svg";
import CustomPagination from "@/components/pagination";
import { CompanyApi } from "../api/company/CompanyApi";

interface FachzubiJob {
  _id: string;
  createdAt: string;
  jobTitle: string;
  email: string;
  address: string;
  jobDescription: string;
  status: boolean;
  startDate?: string;
  companyId?: { companyname: string; email: string };
}

function FachzubiJobs() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<FachzubiJob[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FachzubiJob | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchJobs = async (page: number, recordPerPage: number) => {
    setLoading(true);
    const response: any = await CompanyApi.getFachzubiJobs({
      page,
      recordPerPage,
    });
    if (response?.remote === "success") {
      setJobs(response.data?.jobs ?? []);
      setTotalPages(response.data?.pagination?.totalPages ?? 1);
    }
    setLoading(false);
  };

  const handleToggleStatus = async (job: FachzubiJob) => {
    setTogglingId(job._id);
    const res: any = await CompanyApi.toggleFachzubiJobStatus(job._id);
    if (res?.remote === "success") {
      setJobs((prev) =>
        prev.map((j) => (j._id === job._id ? { ...j, status: res.data.status } : j)),
      );
    }
    setTogglingId(null);
  };

  const handleOpenEdit = (job: FachzubiJob) => {
    router.push(`/fachzubi-jobs/edit?id=${job._id}`);
  };

  const handleOpenDelete = (job: FachzubiJob) => {
    setDeleteTarget(job);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    const res: any = await CompanyApi.deleteFachzubiJob(deleteTarget._id);
    if (res?.remote === "success") {
      setJobs((prev) => prev.filter((j) => j._id !== deleteTarget._id));
      setDeleteOpen(false);
      setDeleteTarget(null);
    } else {
      alert("Failed to delete job.");
    }
    setDeleteLoading(false);
  };

  useEffect(() => {
    fetchJobs(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const filtered = jobs.filter(
    (j) =>
      j.jobTitle?.toLowerCase().includes(searchValue.toLowerCase()) ||
      j.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
      j.companyId?.companyname?.toLowerCase().includes(searchValue.toLowerCase()),
  );

  return (
    <DashboardStyled>
      <MainLayout>
        <Box className="dashboardContent">
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }} className="title">
              Manage Jobs (FZ)
            </Typography>

            <Box className="searchTag">
              <SVG.Search className="images" />
              <TextInput
                placeholder="Search by title, email or company"
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
                      <TableCell sx={{ width: "7%" }}>ID</TableCell>
                      <TableCell sx={{ width: "10%" }}>Date</TableCell>
                      <TableCell sx={{ width: "16%" }}>Job Title</TableCell>
                      <TableCell sx={{ width: "15%" }}>Company</TableCell>
                      <TableCell sx={{ width: "14%" }}>Email</TableCell>
                      <TableCell sx={{ width: "10%" }}>Start Date</TableCell>
                      <TableCell sx={{ width: "9%" }}>Status</TableCell>
                      <TableCell sx={{ width: "7%" }}>Active</TableCell>
                      <TableCell sx={{ width: "13%" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="tbody">
                    {filtered.length > 0 ? (
                      filtered.map((job, index) => (
                        <TableRow key={index}>
                          <TableCell>{job._id?.slice(-6)}</TableCell>
                          <TableCell>
                            {dayjs(job.createdAt).format("DD/MM/YYYY")}
                          </TableCell>
                          <TableCell
                            sx={{ wordBreak: "break-word", whiteSpace: "normal" }}
                          >
                            {job.jobTitle}
                          </TableCell>
                          <TableCell>
                            {job.companyId?.companyname || "—"}
                          </TableCell>
                          <TableCell
                            sx={{ wordBreak: "break-word", whiteSpace: "normal" }}
                          >
                            {job.email}
                          </TableCell>
                          <TableCell>
                            {job.startDate
                              ? dayjs(job.startDate).format("DD/MM/YYYY")
                              : "—"}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={job.status ? "Active" : "Inactive"}
                              size="small"
                              sx={{
                                background: job.status ? "#e6f4ea" : "#fce8e6",
                                color: job.status ? "#1e7e34" : "#c5221f",
                                fontFamily: "Poppins",
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Tooltip title={job.status ? "Set Inactive" : "Set Active"}>
                              <Switch
                                checked={Boolean(job.status)}
                                disabled={togglingId === job._id}
                                onChange={() => handleToggleStatus(job)}
                                size="small"
                                color="success"
                              />
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    router.push(`/fachzubi-jobs/details?id=${job._id}`)
                                  }
                                  sx={{ color: "#1976d2" }}
                                >
                                  <SVG.Eye />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenEdit(job)}
                                  sx={{ color: "#0096A4" }}
                                >
                                  <SVG.Pencil />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenDelete(job)}
                                  sx={{ color: "#d32f2f" }}
                                >
                                  <SVG.Delete />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} align="center">
                          No Fachzubi jobs found
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

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontFamily: "Poppins", fontWeight: 600 }}>Delete Job?</DialogTitle>
          <DialogContent>
            <Typography sx={{ fontFamily: "Poppins", fontSize: 14, color: "#555" }}>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget?.jobTitle}</strong>? This removes it from the
              AzubiB2B list.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDeleteOpen(false)} disabled={deleteLoading} sx={{ textTransform: "none" }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDelete}
              disabled={deleteLoading}
              sx={{ textTransform: "none" }}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </MainLayout>
    </DashboardStyled>
  );
}

export default FachzubiJobs;
