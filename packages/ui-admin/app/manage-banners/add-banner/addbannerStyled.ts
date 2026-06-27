"use client";
import { styled } from "@mui/material";
const AddBannerStyled = styled("div")(() => ({
  "& .title": {
    fontSize: "32px",
    fontWeight: "600",
    fontFamily: "poppins",
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
    // opacity: "1 !important",
    fontSize: "16px",
    fontWeight: "500",
    color: "#000",
    opacity: "1",
  },
  "& .my-select svg": {
    paddingRight: "16px",
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
  "& .jobLabel": {
    display: "flex",
    alignItems: "center",
    margin: "24px 4px",
  },
  "& .jobLabel label": {
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
  "& .customLabel": {
    display: "flex",
    alignItems: "center",
    margin: "24px 4px",
  },
  "& .customLabel label": {
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
  "& .customLabel fieldset": {
    border: "1px solid #646464 !important",
    borderRadius: "10px",
  },
  "& .customLabel input": {
    opacity: "1",
    fontSize: "16px",
    fontWeight: "500",
    color: "#000",
    fontFamily: "poppins",
  },
  "& .customLabel input::plaeholder": {
    opacity: "1!important",
    fontSize: "16px",
    fontWeight: "500",
    fontFamily: "poppins",
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
  "& .additionalFIeld h5": {
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
    color: "#0096A4",
    fontSize: "16px",
    fontWeight: "700",
    fontFamily: "poppins",
  },
  "& .additionalFIeld h5 svg": {
    marginRight: "6px",
  },
  "& .deleteText": {
    color: "#0096A4",
    fontSize: "22px",
    fontFamily: "Poppins",
    fontWeight: "600",
    position: "relative",
    top: "0px",
    marginLeft: "16px",
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
  "& .imageText label span": {
    color: "#000",
    opacity: "0.6",
    fontSize: "14px !important",
    display: "block",
    width: "120px",
    lineHeight: "27px",
  },
}));

export default AddBannerStyled;
