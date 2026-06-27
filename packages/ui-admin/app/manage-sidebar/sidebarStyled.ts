// components/SidebarStyled.js
"use client";

import { styled } from "@mui/material";

const SidebarStyled = styled("div")(() => ({
  "& .title": {
    fontSize: "32px",
    fontWeight: "600",
    fontFamily: "Poppins",
  },
  "& .headerCompany": {
    display: "flex",
    alignItems: "center",
  },
  "& .headerCompany h3": {
    fontSize: "32px",
    margin: "0",
    fontWeight: "500",
  },
  "& .headerCompany svg": {
    marginRight: "16px",
  },
  "& .companyBox": {
    borderRadius: "10px",
    background: "#FDFBFF",
    margin: "22px 0",
    padding: "10px 24px",
  },
  "& .customLabel": {
    display: "flex",
    alignItems: "center",
    margin: "24px 4px",
  },
  "& .imageText": {
    display: "flex",
  },
  "& .imageText label": {
    display: "inline-grid",
    color: "#000",
    fontFamily: "Poppins",
    fontWeight: "500",
  },
  "& .customLabel label": {
    display: "block",
    fontSize: "16px",
    color: "#000000",
    fontFamily: "Poppins",
    fontWeight: "500",
    marginRight: "0",
    width: "176px",
    minWidth: "166px",
  },
  "& .textMenu": {
    fontSize: "32px",
    fontWeight: "400",
    margin: "0",
    padding: "26px 0 32px",
  },
  "& .customLabel fieldset": {
    border: "1px solid #646464 !important",
    borderRadius: "10px",
  },
  "& .customLabel input": {
    opacity: "1",
    fontSize: "16px",
    fontWeight: "500",
    color: "#000",
    fontFamily: "Poppins",
  },
  "& .customLabel input::placeholder": {
    opacity: "1 !important",
    fontSize: "16px",
    fontWeight: "500",
    fontFamily: "Poppins",
    color: "#000",
  },
  "& .btnSubmit": {
    border: "1px solid #0096A4",
    width: "190px",
    height: "59px",
    borderRadius: "10px",
    justifyContent: "flex-start",
    color: "#0096A4",
    fontSize: "24px",
    fontWeight: "700",
    textTransform: "capitalize",
  },
  "& .btnSubmit svg": {
    margin: "0 14px 0 6px",
  },
  "& .selectLabel": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "24px 4px",
  },
  "& .selectLabel label": {
    display: "block",
    fontSize: "16px",
    whiteSpace: "nowrap",
    color: "#000000",
    fontFamily: "Poppins",
    fontWeight: "500",
    marginRight: "0",
    width: "176px",
    minWidth: "176px",
  },
  "& .my-select fieldset": {
    border: "1px solid #646464 !important",
    borderRadius: "10px !important",
  },
  "& .my-select .MuiSelect-select": {
    fontFamily: "Poppins",
    fontSize: "16px",
    fontWeight: "500",
    color: "#000",
    opacity: "1",
  },
  "& .my-select svg": {
    paddingRight: "16px",
  },
  "& .additionalFIeld h5": {
    color: "#0096A4",
    fontSize: "22px",
    fontFamily: "Poppins",
    fontWeight: "600",
  },
  "& .deleteText": {
    color: "#0096A4",
    fontSize: "22px",
    fontFamily: "Poppins",
    fontWeight: "600",
    position: "relative",
    top: "10px",
  },
}));

export default SidebarStyled;
