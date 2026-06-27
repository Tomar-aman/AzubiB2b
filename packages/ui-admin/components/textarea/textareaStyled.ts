import { styled } from "@mui/material";
const TextareaStyled = styled("div")(() => ({
  "& .quill": {
    minHeight: "168px !important",
    maxHeight: "168px!important",
  },
  "& .ql-container.ql-snow": {
    height: "auto",
    minHeight: "126px!important",
    border: "1px solid #646464",
    borderBottomLeftRadius: "10px",
    borderBottomRightRadius: "10px",
  },
  "& .ql-editor.ql-blank": {
    minHeight: "126px !important",
    height: "auto !important",
  },
  "& .ql-toolbar.ql-snow": {
    border: "1px solid #646464",
    borderBottom: "0 !important",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
  },
}));

export default TextareaStyled;
