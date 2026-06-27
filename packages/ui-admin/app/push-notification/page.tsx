"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { SVG } from "@/assets/svg";
import Link from "next/link";
import TableComponent from "@/components/datatable";
import MainLayout from "@/components/layout";
import NotificationStyled from "./notificationStyled";
import { Sidemenu } from "../api/sidemenu/SidemenuApi";
import dayjs from "dayjs";

const columns = [
  { label: "Title", field: "title" },
  { label: "Date", field: "date" },
];

function PushNotification() {
  const [notificationData, setNotificationData] = useState([]);
  const handleSideMenu = async () => {
    const response: any = await Sidemenu.getNotificationData();
    if (response?.remote === "success") {
      setNotificationData(response.data.data);
    } else {
      return response?.error;
    }
  };
  useEffect(() => {
    handleSideMenu();
  }, []);

  const data: any = [];
  notificationData?.map((item: any) => {
    data.push({
      title: item.title,
      date: dayjs(item.createdAt).format("DD MMM YYYY"),
    });
  });
  return (
    <NotificationStyled>
      <MainLayout>
        <Box className="dashboardContent">
          <Box sx={{ p: 4 }} className="noticationTable">
            <Typography variant="h5" sx={{ mb: 2 }} className="title">
              Push Notifiaction
            </Typography>
            <Box
              className="searchTag"
              sx={{
                justifyContent: "end !important",
                marginBottom: "18px !important",
              }}
            >
              <Link href="/push-notification/add-notification">
                {" "}
                <Box className="addNew">
                  <SVG.Add />
                  <span>Send Notification</span>
                </Box>
              </Link>
            </Box>
            <TableComponent columns={columns} data={data} />
          </Box>
        </Box>
      </MainLayout>
    </NotificationStyled>
  );
}
export default PushNotification;
