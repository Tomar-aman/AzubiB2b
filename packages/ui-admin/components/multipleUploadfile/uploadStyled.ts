import { styled } from "@mui/material";
const MultipleFileStyled = styled("div")(() => ({
  "& .uploadFunction input": {
    position: "absolute",
    height: "34px",
    width: "125px",
    opacity: "0",
    display: "block !important",
  },
  "& .uploadPic": {
    background: "#0096A4 !important",
    width: "128px !important",
    height: "28px !important",
    padding: "0 !important",
    borderRadius: "6px !important",
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: "poppins",
    marginBottom: "10px",
    position: "relative",
    zIndex: "1",
  },
  "& .removeBtn": {
    background: "#F6F6F6",
    border: "0",
    width: "128px !important",
    height: "28px !important",
    padding: "0 !important",
    borderRadius: "6px !important",
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: "poppins",
    marginBottom: "10px",
    color: "#00000073",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  "& .inputFile": {
    position: "absolute",
    opacity: "0 !important",
    zIndex: "2",
    width: "126px",
    height: "28px",
    cursor: "pointer"
  },
}));

export default MultipleFileStyled;
