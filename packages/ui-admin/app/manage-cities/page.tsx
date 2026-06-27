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
import CityStyled from "./cityStyled";
import { CityApi } from "../api/city/CityApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface City {
  _id: string;
  name: string;
  address: string;
  status: boolean;
}

function ManageCity() {
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [recordPerPage, setRecordPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState("");

  const handleCities = async (
    pageNo: number,
    recordPerPage: number,
    searchValue: string,
  ) => {
    setLoading(true);
    const response: any = await CityApi.getAllCities(
      pageNo,
      recordPerPage,
      searchValue,
    );

    if (response.remote === "success") {
      setCities(response.data.data.cities);
    } else {
      return response?.error;
    }
    setLoading(false);
  };

  useEffect(() => {
    handleCities(pageNo, recordPerPage, searchValue);
  }, [pageNo, recordPerPage, searchValue]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value); // Update search value on input change
  };

  const handleClickOpen = (id: any) => {
    setSelectedCityId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);

    const response = await CityApi.deleteCity(id);
    if (response.remote === "success") {
      setCities((prevCities) => prevCities.filter((city) => city._id !== id));
    } else {
      alert("Failed to delete the city. Please try again.");
    }

    setOpen(false);
    setLoading(false);
  };

  return (
    <CityStyled>
      <ToastContainer />
      <MainLayout>
        <Box className="dashboardContent">
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }} className="title">
              Manage Cities
            </Typography>
            <Box className="searchTag">
              <SVG.Search className="images" />
              <TextInput
                placeholder="Search"
                className="searchBar"
                value={searchValue}
                onChange={handleSearchChange}
              />
              <Link href="/manage-cities/add-city">
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
                      <TableCell width="20%">City</TableCell>
                      <TableCell width="20%">Address</TableCell>
                      <TableCell width="20%">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="tbody">
                    {cities && cities.length > 0 ? (
                      cities.map((city: City, index: number) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Box className="settingTool">
                              <Link
                                href={`/manage-cities/add-city?id=${city._id}`}
                              >
                                {" "}
                                <SVG.Pencil />
                              </Link>
                              <Link
                                className="btnLink"
                                onClick={() => handleClickOpen(city._id)}
                                href={""}
                              >
                                <SVG.Trash
                                  onClick={() => handleClickOpen(city._id)}
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
                                    Are you sure you want to delete this city?
                                  </Typography>
                                </DialogContent>
                                <DialogActions className="footerButton">
                                  <Button onClick={handleClose} color="primary">
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() => handleDelete(selectedCityId)}
                                    color="error"
                                  >
                                    Remove
                                  </Button>
                                </DialogActions>
                              </Dialog>
                            </Box>
                          </TableCell>
                          <TableCell width="20%">
                            {city.name ? city.name : "-"}
                          </TableCell>
                          <TableCell width="20%">
                            {city.address ? city.address : "-"}
                          </TableCell>
                          <TableCell width="20%">
                            <span
                              onClick={() =>
                                toast.info("To change the status, please contact the Super Admin.")
                              }
                              style={{
                                cursor: "pointer",
                                color: city.status ? "green" : "red",
                              }}
                            >
                              {city.status ? "Active" : "Inactive"}
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
    </CityStyled>
  );
}
export default ManageCity;
