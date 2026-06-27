import { styled } from "@mui/material";
const StylesStyled = styled("div")(() => ({
  "& .title": {
    fontSize: "32px",
    fontWeight: "600",
    fontFamily: "poppins",
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
    zIndex: "99",
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
  "& .customLabel input::placeholder": {
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
  "& .imageText": {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
}));

export default StylesStyled;
