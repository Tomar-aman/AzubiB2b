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
import CustomPagination from "@/components/pagination";
import CityStyled from "./cityStyled";
import { CompanyApi } from "../api/company/CompanyApi";
import { useRouter } from "next/router";
import { SVG } from "@/assets/svg";
import TextInput from "@/components/labelInput";
import Link from "next/link";

interface City {
  _id: string;
  name: string;
  address: string;
  status: boolean;
}

function ManageCity() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [recordPerPage, setRecordPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const handleCities = async (
    id: string,
    pageNo: number,
    recordPerPage: number,
    searchValue: string
  ) => {
    setLoading(true);
    const response: any = await CompanyApi.getAllCities(
      id,
      pageNo,
      recordPerPage,
      searchValue
    );

    if (response.remote === "success") {
      const cities = response.data.data.cities;
      setCities(cities);
    } else {
      return response?.error;
    }
    setLoading(false);
  };

  useEffect(() => {
    if (id && typeof id === "string") {
      handleCities(id, pageNo, recordPerPage, searchValue);
    }
  }, [id, pageNo, recordPerPage, searchValue]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleStatus = async (id: string) => {
    const response = await CompanyApi.updateCityStatus(id);
    if (response.remote === "success") {
      if (
        response.data.message === "Inactive" ||
        response.data.message === "Active"
      ) {
        setCities((prevCities) =>
          prevCities.map((city) =>
            city._id === id
              ? {
                  ...city,
                  status: response.data.message === "Active" ? true : false,
                }
              : city
          )
        );
      } else {
        console.log("Error toggling status:", response.data.message);
      }
    } else {
      return response?.error;
    }
  };

  return (
    <CityStyled>
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
              <Link href={`/manage-cities/add-city?id=${id}`}>
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
                      <TableCell width="20%">City</TableCell>
                      <TableCell width="20%">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="tbody">
                    {cities && cities.length > 0 ? (
                      cities.map((city: City, index: number) => (
                        <TableRow key={index}>
                          <TableCell width="20%">
                            {city.name ? city.name : "-"}
                          </TableCell>
                          <TableCell width="20%">
                            <span
                              onClick={() => handleStatus(city._id)}
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
