"use client";
import { SVG } from "@/assets/svg";
import TextInput from "@/components/labelInput";
import MainLayout from "@/components/layout";
import QuillEditor from "@/components/textarea";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState, useMemo } from "react";
import AddStyled from "./addStyled";
import FilledButton from "@/components/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Sidemenu } from "@/app/api/sidemenu/SidemenuApi";

const HTML_REGEX = /<[^>]*>/g;

export default function AddPushNotification() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [addNotifiaction, setAddNotification] = useState({
    title: "",
    description: "",
  });

  const titleCount = addNotifiaction?.title?.length || 0;
  const descriptionCount = useMemo(() => {
    if (!addNotifiaction?.description) return 0;
    return addNotifiaction.description.replace(HTML_REGEX, "").trim().length;
  }, [addNotifiaction?.description]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddNotification((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const { title, description } = addNotifiaction;
      const descriptionContent = description.replace(HTML_REGEX, "").trim();

      if (title.length < 10 || title.length > 50) {
        toast.error("Title must be between 10 and 50 characters.");
        return;
      }

      if (descriptionContent.length < 50 || descriptionContent.length > 150) {
        toast.error("Description must be between 50 and 150 characters.");
        return;
      }
      setLoading(true);
      const response = await Sidemenu.addSendNotification({
        title,
        description,
      });

      if (response.remote === "success") {
        toast.success("Notification send successfully!");
        router.push("/push-notification");
      }
    } catch (error) {
      console.error("Error sending Notification:", error);
      toast.error("An error occurred while sending notification.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const getCountColor = (count: number, min: number, max: number) => {
    if (count === 0 || count < min) return "#ff9800";
    if (count > max) return "#f44336";
    return "#4caf50";
  };

  return (
    <AddStyled>
      <ToastContainer />
      <MainLayout>
        <Box sx={{ paddingLeft: "260px" }} className="addNew">
          <Box p={3}>
            <Box className="headerCompany">
              <SVG.Arrow onClick={handleGoBack} style={{ cursor: "pointer" }} />
              <h3>Send Push Notification</h3>
            </Box>
          </Box>
          <Box className="companyBox">
            <Box className="customLabel">
              <label>Title</label>
              <TextInput
                type="text"
                placeholder="Enter title"
                name="title"
                value={addNotifiaction.title}
                onChange={handleChange}
              />
            </Box>
            <p style={{ 
              color: getCountColor(titleCount, 10, 50),
              fontSize: '14px',
              fontWeight: 400
            }}>
              {titleCount}/50 characters (minimum 10)
            </p>

            <Box className="customLabel">
              <label>Description</label>
              <QuillEditor
                value={addNotifiaction.description}
                onChange={(value: string) => {
                  setAddNotification((prev) => ({
                    ...prev,
                    description: value,
                  }));
                }}
                placeholder="Enter description"
              />
            </Box>
            <p style={{ 
              color: getCountColor(descriptionCount, 50, 150),
              fontSize: '14px',
              fontWeight: 400
            }}>
              {descriptionCount}/150 characters (minimum 50)
            </p>

            <Box sx={{ textAlign: "end", paddingBottom: "22px" }}>
              <FilledButton
                className="btnSubmit"
                onClick={handleSubmit}
                disabled={loading}
              >
                <SVG.Vector /> Send
              </FilledButton>
            </Box>
          </Box>
        </Box>
      </MainLayout>
    </AddStyled>
  );
}
