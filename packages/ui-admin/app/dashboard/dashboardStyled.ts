"use client";
import { styled } from "@mui/material";
const DashboardStyled = styled("div")(() => ({
  "& .dashboardcard": {
    height: "138px",
    background: "#fff",
    boxShadow: "0px 4px 4px 0px #00000040",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 30px",
  },
  "& .dashboardcard h2": {
    fontSize: "32px",
    fontWeight: "500",
    fontFamily: "Poppins",
    margin: "0",
    letterSpacing: "1px",
  },
  "& .dashboardcard span": {
    background: "#0096A4",
    display: "flex",
    width: "92px",
    height: "92px",
    borderRadius: "100px",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "40px",
    color: "#fff",
    fontFamily: "Poppins",
  },
  "& .title": {
    fontSize: "32px",
    fontWeight: "600",
    fontFamily: "poppins",
  },
}));
export default DashboardStyled;
