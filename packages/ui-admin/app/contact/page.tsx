"use client";

import MainLayout from "@/components/layout";
import React from "react";
import { Box, Typography } from "@mui/material";
import TextInput from "@/components/labelInput";
import { SVG } from "@/assets/svg";
// import CustomPagination from "@/components/pagination";
import TableComponent from "@/components/datatable";
import ContactStyled from "./contactStyled";

const columns = [
  { label: "Action", field: "option" },
  { label: "Name", field: "name" },
  { label: "Phone Number", field: "phoneNumber" },
  { label: "Email", field: "email" },
  { label: "Message", field: "message" },
];

const data = [
  {
    option: (
      <>
        <Box className="settingTool">
          <SVG.Pencil />
          <SVG.Trash />
        </Box>
      </>
    ),
    name: (
      <>
        <h5 className="underLine">Yuvraj Shinde</h5>
      </>
    ),
    phoneNumber: "8989898989",
    email: "yuvrajshinde633@gmail.com",
    message: (
      <>
        <h5 className="underLine">Hello there Nice to meet you</h5>
      </>
    ),
  },
];

function Contact() {
  return (
    <ContactStyled>
      <MainLayout>
        <Box className="dashboardContent">
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }} className="title">
              Contact
            </Typography>
            <Box className="searchTag">
              <SVG.Search className="images" />
              <TextInput placeholder="Search" className="searchBar" />
            </Box>

            {/* Table */}
            <TableComponent columns={columns} data={data} />
            {/* Pagination */}
            {/* <CustomPagination /> */}
          </Box>
        </Box>
      </MainLayout>
    </ContactStyled>
  );
}
export default Contact;
