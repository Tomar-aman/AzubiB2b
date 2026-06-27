"use client";
import MainLayout from "@/components/layout";
import React, { useEffect, useState } from "react";
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
import TextInput from "@/components/labelInput";
import { SVG } from "@/assets/svg";
import CustomPagination from "@/components/pagination";
import Link from "next/link";
import JobStyled from "./jobStyled";
import { JobType } from "../api/jobtype/CreateJobTypeReqResDto";
import { JobTypeApi } from "../api/jobtype/JobTypeApi";
import { useAppSelector } from "@monorepo/ui-core/src/redux/hooks";

function JobTypes() {
  const [loading, setLoading] = useState(false);
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [recordPerPage, setRecordPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedJobTypeId, setSelectedJobTypeId] = useState("");
  const { company } = useAppSelector((state) => state.globalCache);

  const handleJobTypes = async (
    pageNo: number,
    recordPerPage: number,
    searchValue: string,
  ) => {
    setLoading(true);
    const response: any = await JobTypeApi.getAllJobTypes(
      pageNo,
      recordPerPage,
      searchValue,
      company._id,
    );
    if (response.remote === "success") {
      setJobTypes(response.data.data.jobTypes);
    } else {
      return response?.error;
    }
    setLoading(false);
  };

  useEffect(() => {
    if (company) {
      handleJobTypes(pageNo, recordPerPage, searchValue);
    }
  }, [pageNo, recordPerPage, searchValue, company]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value); // Update search value on input change
  };

  const handleClickOpen = (id: any) => {
    setSelectedJobTypeId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    const response = await JobTypeApi.deleteJobType(id);
    if (response.remote === "success") {
      setJobTypes((prevJobTypes) =>
        prevJobTypes.filter((jobType) => jobType._id !== id),
      );
    } else {
      alert("Failed to delete the job-type. Please try again.");
    }
    setOpen(false);
    setLoading(false);
  };

  return (
    <JobStyled>
      <MainLayout>
        <Box className="dashboardContent">
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }} className="title">
              Job Types
            </Typography>
            <Box className="searchTag">
              <SVG.Search className="images" />
              <TextInput
                placeholder="Search"
                className="searchBar"
                value={searchValue}
                onChange={handleSearchChange}
              />
              <Link href="/job-types/add-job">
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
                <Table>
                  <TableHead>
                    <TableRow className="tableHead">
                      <TableCell width="20%">Action</TableCell>
                      <TableCell width="20%">Name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="tbody">
                    {jobTypes && jobTypes.length > 0 ? (
                      jobTypes.map((jobType: JobType, index: number) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Box className="settingTool">
                              <Link
                                href={`/job-types/add-job?id=${jobType._id}`}
                              >
                                {" "}
                                <SVG.Pencil />
                              </Link>
                              <Link
                                className="btnLink"
                                onClick={() => handleClickOpen(jobType._id)}
                                href={""}
                              >
                                <SVG.Trash
                                  onClick={() => handleClickOpen(jobType._id)}
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
                                    job-type?
                                  </Typography>
                                </DialogContent>
                                <DialogActions className="footerButton">
                                  <Button onClick={handleClose} color="primary">
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      handleDelete(selectedJobTypeId)
                                    }
                                    color="error"
                                  >
                                    Remove
                                  </Button>
                                </DialogActions>
                              </Dialog>
                            </Box>
                          </TableCell>
                          <TableCell width="20%">
                            {jobType.jobTypeName ? jobType.jobTypeName : "-"}
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
              page={pageNo}
              rowsPerPage={recordPerPage}
              totalPages={totalPages}
              onPageChange={(newPage) => setPageNo(newPage)}
              onRowsPerPageChange={(newRows) => setRecordPerPage(newRows)}
            />
          </Box>
        </Box>
      </MainLayout>
    </JobStyled>
  );
}
export default JobTypes;
