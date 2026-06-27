"use client";
import MainLayout from "@/components/layout";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import TextInput from "@/components/labelInput";
import { SVG } from "@/assets/svg";
// import CustomPagination from "@/components/pagination";
import TableComponent from "@/components/datatable";
import TrashStyled from "./trashStyled";
import { JobApi } from "../api/jobs/JobApi";
import dayjs from "dayjs";

const columns = [
  { label: "Action", field: "option" },
  { label: "Date", field: "date" },
  { label: "Job Title", field: "jobtitle" },
  { label: "Industry", field: "industry" },
  { label: "City", field: "city" },
  { label: "Status", field: "status" },
];

function Trash() {
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [recordPerPage, setRecordPerPage] = useState(10);
  const [jobData, setJobData] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState("");

  const handleJobTypes = async (searchValue: string) => {
    setLoading(true);
    const response: any = await JobApi.getDeletedJobs(searchValue);

    if (response?.remote === "success") {
      setJobData(response.data.data);
    } else {
      return response?.error;
    }
    setLoading(false);
  };


  useEffect(() => {
    handleJobTypes(searchValue);
  }, [searchValue]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value); // Update search value on input change
  };

  const handleClickOpen = (id: any) => {
    setSelectedJobId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRestore = async (id: string) => {
    setLoading(true);
    const response = await JobApi.restoreJob(id);
    if (response.remote === "success") {
      setJobData((prevJob: any) =>
        prevJob.filter((job: any) => job._id !== id),
      );
    } else {
      alert("Failed to delete the job. Please try again.");
    }
    setOpen(false);
    setLoading(false);
  };

  const data: any = [];
  jobData?.map((item: any) => {
    data.push({
      option: (
        <>
          <Box className="settingTool">
            <SVG.Rotation onClick={() => handleClickOpen(item._id)} />
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
                  Are you sure you want to restore this job?
                </Typography>
              </DialogContent>
              <DialogActions className="footerButton">
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={() => handleRestore(selectedJobId)}
                  color="error"
                >
                  Restore
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </>
      ),
      date: dayjs(item.createdAt).format("DD/MM/YYYY"),
      jobtitle: item.jobTitle,
      industry: item.industryName,
      city: item.cities,
      // status: item.status ? "Active" : "Blocked",
      status: "Inactive",
    });
  });

  return (
    <TrashStyled>
      <MainLayout>
        <Box className="dashboardContent">
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }} className="title">
              Trash
            </Typography>
            <Box className="searchTag">
              <SVG.Search className="images" />
              <TextInput
                placeholder="Search"
                className="searchBar"
                value={searchValue}
                onChange={handleSearchChange}
              />
            </Box>
            {/* Table */}
            {loading ? (
              <CircularProgress />
            ) : (
              <TableComponent columns={columns} data={data} />
            )}{" "}
            {/* Pagination */}
            {/* <CustomPagination /> */}
          </Box>
        </Box>
      </MainLayout>
    </TrashStyled>
  );
}
export default Trash;
