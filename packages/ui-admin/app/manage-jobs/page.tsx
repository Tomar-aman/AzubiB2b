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
import Link from "next/link";
import Datepicker from "@/components/daterangepicker";
import TableComponent from "@/components/datatable";
import JobStyled from "./jobsStyled";
import { JobApi } from "../api/jobs/JobApi";
import dayjs from "dayjs";

const columns = [
  { label: "Action", field: "option" },
  { label: "Date", field: "date" },
  { label: "Job Title", field: "jobTitle" },
  { label: "Industry", field: "industry" },
  { label: "City", field: "city" },
  { label: "Status", field: "status" },
];

function ManageJob() {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [recordPerPage, setRecordPerPage] = useState(10);
  const [jobData, setJobData] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [companyId, setCompanyId] = useState("");

  useEffect(() => {
    const storedCompanyId = localStorage.getItem("companyId") || "";
    setCompanyId(storedCompanyId);
  }, []);

  const handleJobs = async (
    startDate: any,
    endDate: any,
    recordPerPage: number,
    searchValue: string,
    companyId: string,
  ) => {
    setLoading(true);
    const response: any = await JobApi.getAllJob(
      startDate,
      endDate,
      recordPerPage,
      searchValue,
      companyId,
    );

    if (response?.remote === "success") {
      setJobData(response.data.data);
    } else {
      return response?.error;
    }
    setLoading(false);
  };

  const handleStatus = async (id: string) => {
    const response = await JobApi.updateStatus(id);

    if (response.remote === "success") {
      if (
        response.data.message === "Inactive" ||
        response.data.message === "Active"
      ) {
        setJobData((prevJobData: any[]) =>
          prevJobData.map((jobData) =>
            jobData._id === id
              ? {
                ...jobData,
                status: response.data.message === "Active" ? true : false,
              }
              : jobData,
          ),
        );
      } else {
        console.log("Error toggling status:", response.data.message);
      }
    } else {
      return response?.error;
    }
  };

  const handleClickOpen = (id: any) => {
    setSelectedJobId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const data: any = [];
  jobData?.map((item: any) => {
    data.push({
      option: (
        <>
          <Box className="settingTool">
            <SVG.Coin
              onClick={() => handleStatus(item._id)}
              className={item.status ? "activeButton" : "inactiveButton"}
            />
            <Link href={`/manage-jobs/add-job?viewid=${item._id}`}>
              <SVG.Eye />
            </Link>
            <Link href={`/manage-jobs/add-job?copyid=${item._id}`}>
              <SVG.Copy />
            </Link>
            <Link href={`/manage-jobs/add-job?id=${item._id}`}>
              {" "}
              <SVG.Pencil />
            </Link>
            <SVG.Trash onClick={() => handleClickOpen(item._id)} />
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
          </Box>
        </>
      ),
      date: dayjs(item.createdAt).format("DD/MM/YYYY"),
      jobTitle: (
        <>
          <h5 className="underLine">{item.jobTitle}</h5>
        </>
      ),
      industry: item.industryName,
      city: item.concatenatedCities,
      status: (
        <span
          className="statusButton"
          style={{
            cursor: "pointer",
            color: item.status ? "green" : "red",
          }}
        >
          {item.status ? "Active" : "Inactive"}
        </span>
      ),
    });
  });

  useEffect(() => {
    if (companyId) {
      handleJobs(startDate, endDate, recordPerPage, searchValue, companyId);
    }
  }, [startDate, endDate, recordPerPage, searchValue, companyId]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value); // Update search value on input change
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
    setLoading(false);
  };

  return (
    <JobStyled>
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
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Datepicker
                  onDateChange={(dates: any) => {
                    if (Array.isArray(dates) && dates.length === 2) {
                      const startDate = dates[0]; // First date in the array
                      const endDate = dates[1]; // Second date in the array
                      setStartDate(startDate);
                      setEndDate(endDate);
                    } else {
                      console.log("Invalid date selection");
                    }
                  }}
                />
                <Link href="/manage-jobs/add-job">
                  {" "}
                  <Box className="addNew">
                    <SVG.Add />
                    <span>ADD NEW</span>
                  </Box>
                </Link>
              </Box>
            </Box>

            {/* Table */}
            {loading ? (
              <CircularProgress />
            ) : (
              <TableComponent columns={columns} data={data} />
            )}
            {/* Pagination */}
            {/* <CustomPagination /> */}
          </Box>
        </Box>
      </MainLayout>
    </JobStyled>
  );
}
export default ManageJob;
