"use client";
import MainLayout from "@/components/layout";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import FilledButton from "@/components/button";
import { SVG } from "@/assets/svg";
import QuillEditor from "@/components/textarea";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SidebarStyled from "../manage-sidebar/sidebarStyled";
import { PrivacyPolicyApi } from "../api/managePolicy/ManagePolicyApi";

export default function ManagePolicy() {
    const [data, setData] = useState({ description: "" });
    const [loading, setLoading] = useState(false);

    const getCleanDescription = (html: string) => {
        const text = html.replace(/<(.|\n)*?>/g, "").trim(); // remove html tags
        return text ? html : null;
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const cleanDescription = getCleanDescription(data.description);

            const response = await PrivacyPolicyApi.addPrivacyPolicyContent({
                description: cleanDescription,
            });

            if (response.remote === "success") {
                toast.success("Privacy policy updated successfully!");
            }
        } catch (error) {
            console.error("Error updating privacy policy:", error);
            toast.error("An error occurred while updating privacy policy.");
        } finally {
            setLoading(false);
        }
    };

    const handleGetContent = async () => {
        try {
            setLoading(true);
            const response = await PrivacyPolicyApi.getPrivacyPolicyData();

            if (response.remote === "success") {
                const data = response.data.data;
                setData({
                    ...data,
                    description: data.description || "",
                });
            }
        } catch (error) {
            console.error("Error fetching privacy policy:", error);
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
                            <h3>Manage Privacy Policy</h3>
                        </Box>
                        <Box className="companyBox">
                            <Box className="customLabel">
                                <label>Description</label>
                                <QuillEditor
                                    onChange={(e: any) => {
                                        setData((prev: any) => ({
                                            ...prev,
                                            ["description"]: e,
                                        }));
                                    }}
                                    value={data.description}
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
