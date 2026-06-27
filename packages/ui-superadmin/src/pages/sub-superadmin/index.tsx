import MainLayout from "@/components/layout";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DashboardStyled from "../dashboard/dashboardStyled";
import { SVG } from "@/assets/svg";
import TextInput from "@/components/labelInput";
import Link from "next/link";
import { useEffect, useState } from "react";
import CustomPagination from "@/components/pagination";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SubSuperAdminApi } from "../api/subSuperAdmin/SubSuperAdminApi";
import dayjs from "dayjs";

interface SubSuperAdminType {
  _id: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
  status: boolean;
}

export default function SubSuperAdmin() {
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [data, setData] = useState<SubSuperAdminType[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [open, setOpen] = useState(false);

  const handleData = async (
    page: number,
    recordPerPage: number,
    search: string
  ) => {
    setLoading(true);
    const response: any = await SubSuperAdminApi.getAllUsers(
      page,
      recordPerPage,
      search,
    );

    const pagination = response?.data.data.pagination;
    const data = response?.data.data.users;
    if (response?.remote === "success") {
      setData(data);
      setTotalPages(pagination.totalPages);
    } else {
      return response?.error;
    }
    setLoading(false);
  };

  useEffect(() => {
    handleData(page, rowsPerPage, searchValue);
  }, [page, rowsPerPage, searchValue]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleClickOpen = (id: any) => {
    setSelectedUserId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    const response = await SubSuperAdminApi.deleteUserById(id);
    if (response.remote === "success") {
      setData((prev) =>
        prev.filter((itm) => itm._id !== id),
      );
    } else {
      alert("Failed to delete the company. Please try again.");
    }
    setOpen(false);
    setLoading(false);
  };

  return (
    <DashboardStyled>
      <ToastContainer />
      <MainLayout>
        <Box className="dashboardContent">
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }} className="title">
              Manage Sub Super Admin
            </Typography>

            <Box className="searchTag">
              <SVG.Search className="images" />
              <TextInput
                placeholder="Search"
                className="searchBar"
                value={searchValue}
                onChange={handleSearchChange}
              />
              <Link href="/sub-superadmin/add-new">
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
                      <TableCell width="20%">Id</TableCell>
                      <TableCell width="20%">Date</TableCell>
                      <TableCell width="20%">Name</TableCell>
                      <TableCell width="20%">Email</TableCell>
                      <TableCell width="20%">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="tbody">
                    {data && data.length > 0 ? (
                      data.map((item: SubSuperAdminType, index: number) => (
                        <TableRow key={index} className="tableRow">
                          <TableCell width="20%">{item._id.slice(-8)}</TableCell>
                          <TableCell width="20%">
                            {dayjs(item.createdAt).format("DD/MM/YYYY")}
                          </TableCell> <TableCell width="20%">{`${item.firstName} ${item.lastName}`}</TableCell>
                          <TableCell width="20%">{item.email}</TableCell>
                          <TableCell>
                            <Box className="settingTool">
                              <Link
                                href={`/sub-superadmin/view-companies?userId=${item._id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <SVG.Eye />
                              </Link>
                              <Link href={`/sub-superadmin/add-new?id=${item._id}`}>
                                {" "}
                                <SVG.Setting />
                              </Link>
                              <Link
                                className="btnLink"
                                onClick={() => handleClickOpen(item._id)}
                                href={""}
                              >
                                <SVG.Trash
                                  onClick={() => handleClickOpen(item._id)}
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
                                    user?
                                  </Typography>
                                </DialogContent>
                                <DialogActions className="footerButton">
                                  <Button onClick={handleClose} color="primary">
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      handleDelete(selectedUserId)
                                    }
                                    color="error"
                                  >
                                    Remove
                                  </Button>
                                </DialogActions>
                              </Dialog>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No data found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Pagination */}
            <CustomPagination
              page={page}
              rowsPerPage={rowsPerPage}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
              onRowsPerPageChange={(newRows) => setRowsPerPage(newRows)}
            />
          </Box>
        </Box>
      </MainLayout>
    </DashboardStyled>
  );
}
