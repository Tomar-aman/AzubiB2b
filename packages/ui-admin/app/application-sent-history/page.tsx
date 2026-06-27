"use client";
import MainLayout from "@/components/layout";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
} from "@mui/material";
import TextInput from "@/components/labelInput";
import { SVG } from "@/assets/svg";
import CustomPagination from "@/components/pagination";
import Link from "next/link";
import TableComponent from "@/components/datatable";
import HistoryStyled from "./historyStyled";
import { ApplicationApi } from "../api/applications/ApplicationApi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import JSZip from "jszip";

const columns = [
  { label: "Action", field: "option" },
  { label: "Job Title", field: "jobTitle" },
  { label: "Name", field: "name" },
  { label: "Email", field: "email" },
  { label: "Phone Number", field: "phoneNumber" },
  // { label: "Uber mich", field: "uber" },
  // { label: "Begleitschreiben", field: "begleitschreiben" },
  // { label: "Attachements", field: "attachement" },
];

function Contact() {
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [recordPerPage, setRecordPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [open, setOpen] = useState(false);
  const [applications, setApplications] = useState<any>([]);
  const [selectedApplicationId, setSelectedApplicationId] = useState("");

  const handleApplications = async (searchValue: string) => {
    setLoading(true);
    const response: any = await ApplicationApi.getAllApplications(searchValue);

    if (response?.remote === "success") {
      setApplications(response.data.data);
    } else {
      return response?.error;
    }
    setLoading(false);
  };

  useEffect(() => {
    handleApplications(searchValue);
  }, [searchValue]);

  const handleClickOpen = (id: any) => {
    setSelectedApplicationId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    const response = await ApplicationApi.deleteApplication(id);
    if (response.remote === "success") {
      setApplications((prevApplication: any) =>
        prevApplication.filter((application: any) => application._id !== id),
      );
    } else {
      alert("Failed to delete the application. Please try again.");
    }
    setOpen(false);
    setLoading(false);
  };

  const handleDownloadApplication = async (application: any) => {
    const zip = new JSZip();

    // 1. Prepare Excel Data
    const data = [
      {
        "Job Title": application.jobId?.jobTitle || "N/A",
        Name: application.name || "N/A",
        "Phone Number": application.phone || "N/A",
        Email: application.email || "N/A",
        "About Me": application.aboutMe || "N/A",
        Attachments: `Images: ${application.imageCount || 0}, PDFs: ${application.pdfCount || 0}`,
      },
    ];

    // Create a worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Application");

    // Convert workbook to binary
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    zip.file(`Application-${application.name}.xlsx`, excelBuffer);

    // 2. Save Begleitschreiben (Cover Letter) as a TXT file only if it exists
    if (application.coverLetter) {
      zip.file(
        `Begleitschreiben-${application.name}.txt`,
        application.coverLetter,
      );
    }

    // 3. Fetch and Add Attachments to ZIP
    if (application.attachement && application.attachement.length > 0) {
      for (let i = 0; i < application.attachement.length; i++) {
        let fileObj = application.attachement[i];

        if (fileObj?.path) {
          const fileUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${fileObj.path}`;

          try {
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const fileName = fileUrl.split("/").pop() || `Attachment-${i}`;
            zip.file(fileName, blob);
          } catch (error) {
            console.error(`Failed to download attachment: ${fileUrl}`, error);
          }
        } else {
          console.error("Invalid file object format:", fileObj);
        }
      }
    }

    // 4. Generate ZIP File
    zip.generateAsync({ type: "blob" }).then((zipBlob: any) => {
      saveAs(zipBlob, `Application-${application.name}.zip`);
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value); // Update search value on input change
  };

  const data: any = [];
  applications?.map((item: any) => {
    data.push({
      option: (
        <Box className="settingTool">
          <SVG.Download
            onClick={() => handleDownloadApplication(item)}
            style={{ cursor: "pointer" }}
          />
          <Link href={`/application-sent-history/edit-history?id=${item._id}`}>
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
                Are you sure you want to delete this application?
              </Typography>
            </DialogContent>
            <DialogActions className="footerButton">
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => handleDelete(selectedApplicationId)}
                color="error"
              >
                Remove
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      ),
      jobTitle: item.jobId.jobTitle,

      name: item.name,
      phoneNumber: item.phone,
      email: item.email,
      // uber: item.aboutMe,
      // begleitschreiben: item.coverLetter,
      // attachement: `Images: ${item.imageCount}, PDFs: ${item.pdfCount}`,
    });
  });

  return (
    <HistoryStyled>
      <MainLayout>
        <Box className="dashboardContent">
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }} className="title">
              Application Sent History
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
            <TableComponent columns={columns} data={data} />

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
    </HistoryStyled>
  );
}

export default Contact;
