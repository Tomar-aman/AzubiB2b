"use client";
import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Image from "next/image";
import FileStyled from "./fileStyled";
import { SVG } from "@/assets/svg";

// Define props for UploadPicture
interface UploadPictureProps {
  onChange?: (file: File | null) => void;
  value?: string | null; // Accept string or null as value
}

const UploadPicture: React.FC<UploadPictureProps> = ({ onChange, value }) => {
  const [image, setImage] = useState<string | null>(null);

  // Sync local state with external value prop
  useEffect(() => {
    if (value !== undefined) {
      setImage(value); // Update local image state with value prop
    }
  }, [value]);

  // Handle file input change
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImage(result); // Set the image as a preview
        if (onChange) onChange(file); // Call onChange prop with the file
      };
      reader.readAsDataURL(file);
    } else {
      if (onChange) onChange(null); // No file selected
    }
  };

  // Delete the uploaded image
  const handleDelete = () => {
    setImage(null);
    if (onChange) onChange(null); // Notify parent component about deletion
  };

  return (
    <FileStyled>
      <Box style={{ display: "flex", alignItems: "end", gap: "10px" }}>
        {/* Image preview box */}
        <Box
          style={{
            width: "80px",
            height: "80px",
            border: "1px dashed #646464",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#F6F6F6",
            borderRadius: "12px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {image ? (
            <Image
              className="imageUploaded"
              src={image}
              alt="Uploaded preview"
              layout="fill"
              objectFit="contain"
              unoptimized
            />
          ) : (
            <SVG.Picture />
          )}
        </Box>

        {/* Upload and Delete buttons */}
        <Box
          className="uploadFunction"
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            top: "3px",
          }}
        >
          <label htmlFor="upload-input">
            <input
              id="upload-input"
              type="file"
              // accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
            <button
              className="uploadPic"
              type="button"
              style={{
                padding: "10px 20px",
                backgroundColor: "#17a2b8",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Upload picture
            </button>
          </label>

          <button
            onClick={handleDelete}
            className="removeBtn"
            disabled={!image}
            style={{
              marginTop: "0px",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: image ? "pointer" : "not-allowed",
            }}
          >
            <SVG.Delete /> Delete
          </button>
        </Box>
      </Box>
    </FileStyled>
  );
};

export default UploadPicture;
