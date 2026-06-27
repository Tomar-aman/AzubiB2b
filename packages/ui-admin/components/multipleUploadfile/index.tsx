"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import Image from "next/image";
import MultipleFileStyled from "./uploadStyled";
import { JobApi } from "@/app/api/jobs/JobApi";
import { AuthApi } from "@/app/api/auth/AuthApi";
import { NewsApi } from "@/app/api/news/NewsApi";

interface MultipleUploadPictureProps {
  onChange?: (files: File[] | null, existingImages: string[]) => void;
  value?: string[] | null;
  jobId?: any;
  companyId?: any;
  newsId?: any;
  type?: any;
  disabled?: boolean;
  existingServerImages?: any[];
  onExistingImagesChange?: (images: any[]) => void;
}

const MultipleUploadPicture: React.FC<MultipleUploadPictureProps> = ({
  onChange,
  value,
  jobId,
  companyId,
  newsId,
  type,
  disabled = false,
  existingServerImages = [],
  onExistingImagesChange,
}) => {
  const [displayImages, setDisplayImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [currentExistingImages, setCurrentExistingImages] = useState<any[]>([]);

  const inputId = useMemo(() => `upload-input-${Math.random()}`, []);

  // Initialize with server images
  useEffect(() => {
    if (value && Array.isArray(value)) {
      setDisplayImages(value);
    }
    if (existingServerImages) {
      setCurrentExistingImages(existingServerImages);
    }
  }, [value, existingServerImages]);

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");

        // resize logic (reduce size)
        const maxWidth = 800;
        const scaleSize = maxWidth / img.width;

        canvas.width = maxWidth;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        // convert to JPEG/WebP + compress
        canvas.toBlob(
          (blob) => {
            if (!blob) return;

            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
            });

            resolve(compressedFile);
          },
          "image/jpeg", // or "image/webp"
          0.7 // 🔥 quality (0.0 - 1.0)
        );
      };
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // const fileArray: File[] = Array.from(files);
    const fileArray: any = await Promise.all(
      Array.from(files).map(async (file) => {
        if (file.type === "image/png") {
          alert("PNG not allowed. Please upload JPEG or WEBP.");
          return null;
        }

        return await compressImage(file);
      })
    );

    const validFiles = fileArray.filter((f: any): f is File => f !== null);

    const updatedNewFiles = [...newFiles, ...fileArray];
    setNewFiles(updatedNewFiles);

    // Create previews for newly selected files
    const newPreviews: string[] = [];
    let loadedCount = 0;

    fileArray.forEach((file: any, idx: any) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        loadedCount++;

        if (loadedCount === fileArray.length) {
          setDisplayImages((prev) => {
            return [...prev, ...newPreviews];
          });

          if (onChange) {
            const existingImageUrls = currentExistingImages.map((img: any) =>
              typeof img === "string" ? img : img.file,
            );
            onChange(updatedNewFiles, existingImageUrls);
          }
        }
      };
      reader.readAsDataURL(file);
    });

    event.target.value = "";
  };

  const getPublicPath = (url: string) => {
    const index = url.indexOf("/public");
    return index !== -1 ? url.substring(index) : url;
  };

  const handleDelete = async (index: number) => {
    const isServerImage = index < currentExistingImages.length;

    if (isServerImage) {
      const serverImageObj = currentExistingImages[index];
      const fileUrl = displayImages[index];

      if (companyId || jobId || newsId) {
        try {
          const publicPath = getPublicPath(fileUrl);

          if (jobId) {
            await JobApi.deleteJobFile(jobId, type, publicPath);
          } else if (companyId) {
            await AuthApi.deleteCompanyImages(companyId, publicPath);
          } else if (newsId) {
            await NewsApi.deleteNewsImages(newsId, publicPath);
          }
        } catch (error) {
          console.error("Error deleting server image:", error);
          return;
        }
      }

      // Remove from existing images array
      const updatedExistingImages = currentExistingImages.filter(
        (_, i) => i !== index,
      );
      setCurrentExistingImages(updatedExistingImages);

      // Notify parent about updated existing images
      if (onExistingImagesChange) {
        onExistingImagesChange(updatedExistingImages);
      }

      // Remove from display
      setDisplayImages((prev) => prev.filter((_, i) => i !== index));

      // Notify parent with current state
      if (onChange) {
        const existingImageUrls = updatedExistingImages.map((img: any) =>
          typeof img === "string" ? img : img.file,
        );
        onChange(newFiles, existingImageUrls);
      }
    } else {
      const localIndex = index - currentExistingImages.length;
      const updatedNewFiles = newFiles.filter((_, i) => i !== localIndex);

      setNewFiles(updatedNewFiles);
      setDisplayImages((prev) => prev.filter((_, i) => i !== index));

      // Notify parent
      if (onChange) {
        const existingImageUrls = currentExistingImages.map((img: any) =>
          typeof img === "string" ? img : img.file,
        );
        onChange(updatedNewFiles, existingImageUrls);
      }
    }
  };

  return (
    <MultipleFileStyled>
      <Box style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {displayImages.map((image, index) => (
          <Box
            key={`image-${index}-${image.substring(image.length - 10)}`}
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
            <Image
              src={image}
              alt={`Uploaded preview ${index}`}
              layout="fill"
              objectFit="contain"
              unoptimized
            />
            <button
              onClick={() => handleDelete(index)}
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                backgroundColor: "rgba(0,0,0,0.7)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                cursor: "pointer",
                fontSize: "16px",
                lineHeight: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              disabled={disabled}
            >
              ×
            </button>
          </Box>
        ))}

        <label style={{ position: "relative" }} htmlFor={inputId}>
          <input
            id={inputId}
            type="file"
            multiple
            accept="image/jpeg, image/webp"
            className="inputFile"
            onChange={handleImageUpload}
            disabled={disabled}
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
            disabled={disabled}
          >
            Upload pictures
          </button>
        </label>
      </Box>
    </MultipleFileStyled>
  );
};

export default MultipleUploadPicture;
