"use client";
import MainLayout from "@/components/layout";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import { SVG } from "@/assets/svg";
import Link from "next/link";
import TableComponent from "@/components/datatable";
import MenuStyled from "./menuStyled";
import { Sidemenu } from "../api/sidemenu/SidemenuApi";

const columns = [
  { label: "Action", field: "action" },
  { label: "Side menu name", field: "sideMenu" },
  { label: "URL", field: "url" },
];

function SideMenuContent() {
  // const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [sideMenuData, setSideMenuData] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  const handleSideMenu = async () => {
    const response: any = await Sidemenu.getSideMenuData();
    if (response?.remote === "success") {
      setSideMenuData(response.data.data.SideMenus);
    } else {
      return response?.error;
    }
  };

  useEffect(() => {
    handleSideMenu();
  }, []);

  const handleClickOpen = (id: any) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const data: any = [];
  sideMenuData?.map((item: any) => {
    data.push({
      action: (
        <>
          <Box className="settingTool">
            <Link href={`/side-menu-content/add-menu-content?id=${item._id}`}>
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
                  Are you sure you want to delete this content?
                </Typography>
              </DialogContent>
              <DialogActions className="footerButton">
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={() => handleDelete(selectedId)} color="error">
                  Remove
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </>
      ),
      sideMenu: item?.name,
      url: item?.url,
    });
  });

  const handleDelete = async (id: string) => {
    setLoading(true);
    const response = await Sidemenu.deleteSidemenu(id);
    if (response.remote === "success") {
      setSideMenuData((prevJob: any) =>
        prevJob.filter((job: any) => job._id !== id),
      );
    } else {
      alert("Failed to delete the SideMenu. Please try again.");
    }
    setOpen(false);
    setLoading(false);
  };
  return (
    <MenuStyled>
      <MainLayout>
        <Box className="dashboardContent">
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }} className="title">
              Side Menu Content
            </Typography>
            <Box
              className="searchTag"
              sx={{
                justifyContent: "end !important",
                marginBottom: "18px !important",
              }}
            >
              <Link href="/side-menu-content/add-menu-content">
                {" "}
                <Box className="addNew">
                  <SVG.Add />
                  <span>ADD NEW</span>
                </Box>
              </Link>
            </Box>
            <TableComponent columns={columns} data={data} />
          </Box>
        </Box>
      </MainLayout>
    </MenuStyled>
  );
}
export default SideMenuContent;
