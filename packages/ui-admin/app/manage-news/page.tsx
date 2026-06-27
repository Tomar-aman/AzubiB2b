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
import NewsStyled from "./newsStyled";
import { News } from "../api/news/CreateNewsReqResDto";
import { NewsApi } from "../api/news/NewsApi";

function ManageNews() {
    const [loading, setLoading] = useState(false);
    const [news, setNews] = useState<News[]>([]);
    const [pageNo, setPageNo] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [recordPerPage, setRecordPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [open, setOpen] = useState(false);
    const [selectedNewsId, setSelectedNewsId] = useState("");

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value); // Update search value on input change
    };

    const handleClickOpen = (id: any) => {
        setSelectedNewsId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async (id: string) => {
        setLoading(true);
        const response = await NewsApi.deleteNews(id);
        if (response.remote === "success") {
            setNews((prevNews) =>
                prevNews.filter((itm) => itm._id !== id),
            );
        } else {
            alert("Failed to delete the industry. Please try again.");
        }
        setOpen(false);
        setLoading(false);
    };

    const handleNews = async (
        pageNo: number,
        recordPerPage: number,
        searchValue: string,
    ) => {
        setLoading(true);
        const response: any = await NewsApi.getAllNews(
            pageNo,
            recordPerPage,
            searchValue,
        );

        if (response?.remote === "success") {
            setNews(response.data.data.news);
        } else {
            return response?.error;
        }
        setLoading(false);
    };

    useEffect(() => {
        handleNews(pageNo, recordPerPage, searchValue);
    }, [pageNo, recordPerPage, searchValue]);

    return (
        <NewsStyled>
            <MainLayout>
                <Box className="dashboardContent">
                    <Box sx={{ p: 4 }}>
                        <Typography variant="h5" sx={{ mb: 2 }} className="title">
                            Manage News
                        </Typography>
                        <Box className="searchTag">
                            <SVG.Search className="images" />
                            <TextInput
                                placeholder="Search"
                                className="searchBar"
                                value={searchValue}
                                onChange={handleSearchChange}
                            />
                            <Link href="/manage-news/add-news">
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
                                            <TableCell width="5%">Action</TableCell>
                                            <TableCell width="20%">Title</TableCell>
                                            <TableCell width="20%">Description</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody className="tbody">
                                        {news && news.length > 0 ? (
                                            news.map((data: News, index: number) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <Box className="settingTool">
                                                            <Link
                                                                href={`/manage-news/add-news?id=${data._id}`}
                                                            >
                                                                {" "}
                                                                <SVG.Pencil />
                                                            </Link>
                                                            <Link
                                                                className="btnLink"
                                                                onClick={() => handleClickOpen(data._id)}
                                                                href={""}
                                                            >
                                                                <SVG.Trash
                                                                    onClick={() => handleClickOpen(data._id)}
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
                                                                        news?
                                                                    </Typography>
                                                                </DialogContent>
                                                                <DialogActions className="footerButton">
                                                                    <Button onClick={handleClose} color="primary">
                                                                        Cancel
                                                                    </Button>
                                                                    <Button
                                                                        onClick={() =>
                                                                            handleDelete(selectedNewsId)
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
                                                        {data.title}
                                                    </TableCell>
                                                    <TableCell width="20%">
                                                        {data.description.replace(/<[^>]+>/g, "")}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center">
                                                    No Data found
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
        </NewsStyled>
    );
}
export default ManageNews;
