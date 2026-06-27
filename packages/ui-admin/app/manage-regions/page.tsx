"use client";
import MainLayout from "@/components/layout";
import React from "react";
import { Box, Typography } from "@mui/material";
import TextInput from "@/components/labelInput";
import { SVG } from "@/assets/svg";
// import CustomPagination from "@/components/pagination";
import Link from "next/link";
import TableComponent from "@/components/datatable";
import RegionStyled from "./regionStyled";

const columns = [
  { label: "Action", field: "option" },
  // { label: 'Date', field: 'date' },
  { label: "Region Name", field: "regionName" },
];

const data = [
  {
    // date: '10/12/2023',
    option: (
      <>
        <Box className="settingTool">
          <SVG.Pencil />
          <SVG.Trash />
        </Box>
      </>
    ),
    regionName: "North",
  },
];

function ManageRegions() {
  return (
    <RegionStyled>
      <MainLayout>
        <Box className="dashboardContent">
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }} className="title">
              Manage regions
            </Typography>
            <Box className="searchTag">
              <SVG.Search className="images" />
              <TextInput placeholder="Search" className="searchBar" />
              <Link href="/manage-regions/add-region">
                {" "}
                <Box className="addNew">
                  <SVG.Add />
                  <span>ADD NEW</span>
                </Box>
              </Link>
            </Box>

            {/* Table */}
            <TableComponent columns={columns} data={data} />
            {/* Pagination */}
            {/* <CustomPagination /> */}
          </Box>
        </Box>
      </MainLayout>
    </RegionStyled>
  );
}
export default ManageRegions;
