"use client";
import { styled } from "@mui/material";
const NewsStyled = styled("div")(() => ({
  "& .title": {
    fontSize: "32px",
    fontWeight: "600",
    fontFamily: "poppins",
  },
  "& .searchTag": {
    display: "flex",
    justifyContent: "space-between",
    position: "relative",
    marginBottom: "10px",
    alignItems: "center",
  },
  "& .searchTag .images": {
    position: "absolute",
    top: "17px",
  },
  "& .searchBar fieldset": {
    border: "0 !important",
  },
  "& .searchBar input": {
    fontFamily: "poppins",
    fontSize: "20px",
    color: "#000",
    paddingLeft: "40px",
  },
  "& .searchBar": {
    width: "70%",
  },
  "& .addNew": {
    display: "flex",
    alignItems: "center",
  },
  "& .addNew span": {
    fontSize: "20px",
    color: "#646464",
    fontFamily: "poppins",
    fontWeight: "700",
  },
  "& .addNew svg": {
    marginRight: "10px",
  },
  "& .tableHead th": {
    color: "#000000",
    fontSize: "16px",
    fontFamily: "Poppins",
    fontWeight: "600",
    borderBottom: "0 !important",
    padding: "20px 0",
  },
  "& .mainTable": {
    borderRadius: "10px",
    background: "#FDFBFF",
  },
  "& .mainTable table": {
    margin: "10px auto",
    width: "97%",
  },
  "& .tbody tr:last-child td": {
    borderBottom: "0 !important",
  },
  "& .tbody tr td": {
    borderTop: "1px solid #646464 !important",
    borderBottom: "1px solid #646464 !important",
    fontSize: "14px",
    fontWeight: "500",
    color: "#000000",
    fontFamily: "Poppins",
    padding: "20px 0",
  },
  "& .selectBox fieldset": {
    border: "0 !important",
  },
  "& .selectBox .MuiSelect-select": {
    fontSize: "20px",
    fontFamily: "Poppins",
    fontWeight: "400",
    paddingBottom: "0",
  },
  "& .selectBox p": {
    fontSize: "20px",
    fontFamily: "Poppins",
    fontWeight: "500",
    color: "#646464",
  },
  "& .MuiPaginationItem-previousNext": {
    display: "none",
  },
  "& .nextBtn": {
    fontFamily: "Poppins",
    color: "#646464 !important",
    fontSize: "20px",
    textTransform: "capitalize",
  },
  "& .paginationBox nav li button": {
    fontFamily: "Poppins",
    color: "#646464 ",
    fontSize: "20px",
    textTransform: "capitalize",
  },
  "& .paginationBox nav li .Mui-selected": {
    fontFamily: "Poppins",
    color: "#fff !important",
    fontSize: "20px",
    textTransform: "capitalize",
    background: " #0096A4",
    width: "60px",
    height: "60px",
    borderRadius: "0",
  },
  "& .prevBtn": {
    background: "#0096A4",
    width: "90px",
    height: "60px",
    fontSize: "20px",
    color: "#fff",
    fontWeight: "500",
    fontFamily: "Poppins",
    borderTopLeftRadius: "0",
    borderBottomLeftRadius: "0",
    borderTopRightRadius: "9px",
    textTransform: "capitalize",
    borderBottomRightRadius: "9px",
  },
  "& .settingTool": {
    display: "flex",
  },
  "& .settingTool svg": {
    marginRight: "10px",
  },
}));
export default NewsStyled;
