import { styled } from "@mui/material";
const DatepickerStyled = styled("div")(() => ({
  "& .react-datepicker__input-container input": {
    background: "transparent !important",
    outline: "0 !important",
    border: "0 !important",
    color: "#646464",
    fontFamily: "Poppins",
    fontSize: "18px",
    fontWeight: "500",
    cursor: "pointer",
  },
  "& .react-datepicker__close-icon": {
    right: "-20px !important",
  },
}));

export default DatepickerStyled;
