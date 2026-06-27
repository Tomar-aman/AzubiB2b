import { styled } from "@mui/material";
const LoginrStyled = styled("div")(() => ({
  "& .login": {
    textAlign: "center",
  },
  "& .login h1": {
    fontSize: "40px",
    fontWeight: "700",
    margin: "0",
  },
  "& .login h3": {
    fontSize: "36px",
    fontWeight: "600",
    margin: "0",
    padding: "6px 6px 30px",
  },
  "& .loginField": {
    height: "70px",
    marginBottom: "24px",
  },
  "& .loginField fieldset": {
    borderColor: "#0096A4 !important",
    border: "1px solid #0096A4 !important",
    borderRadius: "10px",
  },
  "& .loginField input": {
    height: "38px",
    fontSize: "24px",
    color: "#000",
    fontFamily: "Poppins",
    borderRadius: "10px",
  },
  "& .loginField .Mui-focused fieldset": {
    borderWidth: "1 !important",
  },
  "& .loginBtn": {
    width: "100%",
    background: "#0096A4",
    height: "71px",
    fontSize: "32px",
    color: "#fff",
    fontWeight: "700",
    textTransform: "capitalize",
    fontFamily: "Poppins",
    borderRadius: "10px",
  },
  "& .login svg": {
    margin: "6px 35px 20px",
  },
  "& .loginHead": {
    display: "flex",
    alignItems: "center",
    height: "100vh",
  },
}));

export default LoginrStyled;
