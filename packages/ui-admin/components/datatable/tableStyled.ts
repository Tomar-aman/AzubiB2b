import { styled } from "@mui/material";
const TableStyled = styled("div")(() => ({
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
}));
export default TableStyled;
