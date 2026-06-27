"use client";
import MainLayout from "@/components/layout";
import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { SVG } from "@/assets/svg";
// import CustomPagination from "@/components/pagination";
import CompanyStyled from "./companyStyles";
import { AuthApi } from "../api/auth/AuthApi";
import Link from "next/link";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Company {
  _id: string;
  createdAt: string;
  companyname: string;
  email: string;
  contactPerson: string;
  industry: string;
  city: string;
  status: boolean;
}

function ManageCompany() {
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState<Company[]>([]);

  const handleCompany = async () => {
    setLoading(true);
    const response: any = await AuthApi.getCompanyById();

    if (response?.remote === "success") {
      setCompany(response.data.data);
    } else {
      return response?.error;
    }
    setLoading(false);
  };

  useEffect(() => {
    handleCompany();
  }, []);

  // const handleStatus = async (id: string) => {
  //   const response = await AuthApi.updateStatus(id);
  //   console.log("Response--", response);

  //   if (response.remote === "success") {
  //     if (
  //       response.data.message === "Inactive" ||
  //       response.data.message === "Active"
  //     ) {
  //       setCompany((prevCompany) =>
  //         prevCompany.map((company) =>
  //           company._id === id
  //             ? {
  //                 ...company,
  //                 status: response.data.message === "Active" ? true : false,
  //               }
  //             : company,
  //         ),
  //       );
  //     } else {
  //       console.log("Error toggling status:", response.data.message);
  //     }
  //   } else {
  //     return response?.error;
  //   }
  // };

  return (
    <CompanyStyled>
      <ToastContainer />
      <MainLayout>
        <Box className="dashboardContent">
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }} className="title">
              Manage Company
            </Typography>
            {/* Table */}
            {loading ? (
              <CircularProgress />
            ) : (
              <TableContainer component={Paper} className="mainTable">
                <Table>
                  <TableHead>
                    <TableRow className="tableHead">
                      <TableCell width="20%">Action</TableCell>
                      <TableCell width="20%">Date</TableCell>
                      <TableCell width="20%">Company Name</TableCell>
                      <TableCell width="20%">Email</TableCell>
                      <TableCell width="20%">Contact Person</TableCell>
                      <TableCell width="20%">Industry</TableCell>
                      <TableCell width="20%">City</TableCell>
                      <TableCell width="20%">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="tbody">
                    {company && company.length > 0 ? (
                      company.map((item: Company, index: number) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Box className="settingTool">
                              <Link
                                href={`/manage-company/add-company?id=${item._id}`}
                              >
                                {" "}
                                <SVG.Pencil />
                              </Link>
                            </Box>
                          </TableCell>
                          <TableCell width="20%">
                            {dayjs(item.createdAt).format("DD/MM/YYYY")}
                          </TableCell>
                          <TableCell width="20%">{item.companyname}</TableCell>
                          <TableCell width="20%">{item.email}</TableCell>
                          <TableCell width="20%">
                            {item.contactPerson}
                          </TableCell>
                          <TableCell width="20%">{item.industry}</TableCell>
                          <TableCell width="20%">{item.city}</TableCell>
                          <TableCell width="20%">
                            <span
                              className="statusButton"
                              onClick={() =>
                                toast.info("To change the status, please contact the Super Admin.")
                              } style={{
                                cursor: "pointer",
                                color: item.status ? "green" : "red",
                              }}
                            >
                              {item.status ? "Active" : "Inactive"}
                            </span>
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
            {/* <CustomPagination /> */}
          </Box>
        </Box>
      </MainLayout>
    </CompanyStyled>
  );
}
export default ManageCompany;
