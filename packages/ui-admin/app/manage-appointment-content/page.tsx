"use client"
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout";
import SidebarStyled from "../manage-sidebar/sidebarStyled";
import { Box } from "@mui/material";
import FilledButton from "@/components/button";
import { SVG } from "@/assets/svg";
import QuillEditor from "@/components/textarea";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppointmentApi } from "../api/manageAppointment/ManageAppointmentApi";

export default function ManageAppointmentContent() {
    const [data, setData] = useState({ text: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const { text } = data;

            const response = await AppointmentApi.addAppointmentContent({ text });

            if (response.remote === "success") {
                toast.success("Appointment content updated successfully!");
            }
        } catch (error) {
            console.error("Error updating appointment content:", error);
            toast.error("An error occurred while updating appointment content.");
        } finally {
            setLoading(false);
        }
    };

    const handleGetContent = async () => {
        try {
            setLoading(true);
            const response = await AppointmentApi.getAppointmentData();

            if (response.remote === "success") {
                const data = response.data.data;
                setData({
                    ...data,
                    text: data.text || "",
                });
            }
        } catch (error) {
            console.error("Error fetching appointment content:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleGetContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <SidebarStyled>
            <ToastContainer />
            <MainLayout>
                <Box sx={{ paddingLeft: "260px" }} className="addNew">
                    <Box p={3}>
                        <Box className="headerCompany">
                            <h3>Manage Appointment Content</h3>
                        </Box>
                        <Box className="companyBox">
                            <Box className="customLabel">
                                <label>Text</label>
                                <QuillEditor
                                    onChange={(e: any) => {
                                        setData((prev: any) => ({
                                            ...prev,
                                            ["text"]: e,
                                        }));
                                    }}
                                    value={data.text}
                                />
                            </Box>

                            <Box sx={{ textAlign: "end", paddingBottom: "22px" }}>
                                <FilledButton
                                    className="btnSubmit"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                >
                                    <SVG.Vector /> Submit
                                </FilledButton>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </MainLayout>
        </SidebarStyled>
    );
}