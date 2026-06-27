"use client";
import MainLayout from "@/components/layout";
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import TextInput from "@/components/labelInput";
import { SVG } from "@/assets/svg";
// import CustomPagination from "@/components/pagination";
import TableComponent from "@/components/datatable";
import AlarmStyled from "./alarmStyled";
import Datepicker from "@/components/daterangepicker";
import { ContentApi } from "../api/content/ContentApi";

const columns = [
  { label: "Name", field: "name" },
  { label: "Email", field: "email" },
  { label: "Job Type", field: "jobtype" },
  { label: "City", field: "city" }
];

function JobAlarm() {
  const [searchValue, setSearchValue] = useState("");
  const [jobAlarmData, setJobAlarmData] = useState<any>([]);

  const handleJobalarm = async (searchValue: string) => {
    const response: any = await ContentApi.getJobAlarmData(searchValue);
    if (response?.remote === "success") {
      setJobAlarmData(response.data.data);
    } else {
      return response?.error;
    }
  };

  useEffect(() => {
    handleJobalarm(searchValue);
  }, [searchValue]);

  const data: any = [];
  jobAlarmData?.map((item: any) => {
    data.push({
      name: item.name,
      jobtype: item.jobTypeName,
      email: item.email,
      city: item.cityName
    });
  });

  return (
    <AlarmStyled>
      <MainLayout>
        <Box className="dashboardContent">
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }} className="title">
              Job alarm history registration
            </Typography>
            <Box className="searchTag">
              <SVG.Search className="images" />
              <TextInput
                placeholder="Search"
                className="searchBar"
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <Datepicker />
            </Box>

            {/* Table */}
            <TableComponent columns={columns} data={data} />
            {/* Pagination */}
            {/* <CustomPagination /> */}
          </Box>
        </Box>
      </MainLayout>
    </AlarmStyled>
  );
}
export default JobAlarm;
