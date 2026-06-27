import MainLayout from "@/components/layout";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import { SVG } from "@/assets/svg";
import TextInput from "@/components/labelInput";
import { useEffect, useState } from "react";
import DashboardStyled from "../dashboard/dashboardStyled";
import CustomPagination from "@/components/pagination";
import { JobApi } from "../api/jobs/jobApi";

export default function ManageJobs() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [userId, setUserId] = useState("");
  const [page, setPage] = useState(1);
  const [recordPerPage, setRecordPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [jobData, setJobData] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId") || "";
    setUserId(storedUserId);
  }, []);

  const handleJobs = async (
    page: number,
    recordPerPage: number,
    searchValue: string,
    companyId: string,
    userId: string,
  ) => {
    setLoading(true);
    const response: any = await JobApi.getAllJob(
      page,
      recordPerPage,
      searchValue,
      companyId,
      userId,
    );

    if (response?.remote === "success") {
      setJobData(response.data.data);
    } else {
      return response?.error;
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userId) {
      handleJobs(page, recordPerPage, searchValue, companyId, userId);
    }
  }, [page, recordPerPage, searchValue, companyId, userId]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value); // Update search value on input change
  };

  const handleClickOpen = (id: any) => {
    setSelectedJobId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedJobId("");
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    const response = await JobApi.deleteJob(id);
    if (response.remote === "success") {
      setJobData((prevJob: any) =>
        prevJob.filter((job: any) => job._id !== id),
      );
    } else {
      alert("Failed to delete the job. Please try again.");
    }
    setOpen(false);
    setSelectedJobId("");
    setLoading(false);
  };

  return (
    <DashboardStyled>
      <MainLayout>
        <Box className="dashboardContent">
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }} className="title">
              Manage Jobs
            </Typography>

            <Box className="searchTag">
              <SVG.Search className="images" />
              <TextInput
                placeholder="Search"
                className="searchBar"
                value={searchValue}
                onChange={handleSearchChange}
              />
              <Link href="/manage-jobs/add-job">
                {" "}
                <Box className="addNew">
                  <SVG.Add />
                  <span>ADD NEW</span>
                </Box>
              </Link>
            </Box>
            {loading ? (
              <CircularProgress />
            ) : (
              <TableContainer component={Paper} className="mainTable">
                <Table>
                  <TableHead>
                    <TableRow className="tableHead">
                      <TableCell width="10%">Job Title</TableCell>
                      <TableCell width="10%">Company</TableCell>
                      <TableCell width="10%">City</TableCell>
                      <TableCell width="10%">Industry</TableCell>
                      <TableCell width="10%">Date</TableCell>
                      <TableCell width="10%">Status</TableCell>
                      <TableCell width="10%">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="tbody">
                    {jobData?.length > 0 ? (
                      jobData.map((job: any) => (
                        <TableRow key={job._id}>
                          <TableCell width="10%">
                            {job.jobTitle || "-"}
                          </TableCell>
                          <TableCell width="10%">
                            {job.companyName || "-"}
                          </TableCell>
                          <TableCell width="10%">
                            {job.concatenatedCities || "-"}
                          </TableCell>
                          <TableCell width="10%">
                            {job.industryName || "-"}
                          </TableCell>
                          <TableCell width="10%">
                            {job.createdAt
                              ? new Date(job.createdAt).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          <TableCell width="10%">
                            {job.status ? "Active" : "Inactive"}
                          </TableCell>
                          <TableCell width="10%">
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                alignItems: "center",
                              }}
                            >
                              <Link href={`/manage-jobs/add-job?id=${job._id}`}>
                                <SVG.Pencil style={{ cursor: "pointer" }} />
                              </Link>
                              <Box sx={{ cursor: "pointer" }}>
                                <SVG.Trash onClick={() => handleClickOpen(job._id)} />
                              </Box>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No jobs found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            <Dialog open={open} className="deleteDialog" onClose={handleClose}>
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
                  Are you sure you want to delete this industry?
                </Typography>
              </DialogContent>
              <DialogActions className="footerButton">
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDelete(selectedJobId)}
                  color="error"
                >
                  Remove
                </Button>
              </DialogActions>
            </Dialog>

            <CustomPagination
              page={page}
              rowsPerPage={recordPerPage}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
              onRowsPerPageChange={(newRows) => setRecordPerPage(newRows)}
            />
          </Box>
        </Box>
      </MainLayout>
    </DashboardStyled>
  );
}
