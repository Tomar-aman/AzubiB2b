"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import TextareaStyled from "./textareaStyled";
import { Box } from "@mui/material";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
}) as React.ComponentType<{
  value: string;
  onChange: (value: string) => void;
  theme?: string;
  placeholder?: string;
}>;

const QuillEditor = ({ onChange, value }: any) => {
  const [editorContent, setEditorContent] = useState<string>("");

  const handleChange = (value: string) => {
    setEditorContent(value);
  };
  useEffect(() => {
    if (onChange) {
      onChange(editorContent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorContent]);

  useEffect(() => {
    setEditorContent(value);
  }, [value]);
  return (
    <TextareaStyled sx={{ width: "100%" }}>
      <Box className="textAreaBox">
        <ReactQuill
          value={editorContent}
          onChange={handleChange}
          theme="snow"
          placeholder="Write here"
        />
      </Box>
    </TextareaStyled>
  );
};

export default QuillEditor;
