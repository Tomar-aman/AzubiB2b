import MainLayout from "@/components/layout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddCityStyled from "../manage-cities/add-city/addCityStyled";
import { Box } from "@mui/material";
import QuillEditor from "@/components/textarea";
import FilledButton from "@/components/button";
import { SVG } from "@/assets/svg";
import TextInput from "@/components/labelInput";
import UploadPicture from "@/components/uploadFIle";
import { useEffect, useState } from "react";
import { JobFormContentApi } from "../api/jobFormContent/jobFormContentApi";

export default function ManageJobFormContent() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<{
        coverLetter: string;
    }>({
        coverLetter: ""
    });

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const { coverLetter } = data;

            const response = await JobFormContentApi.addContent({
                coverLetter
            });

            if (response.remote === "success") {
                toast.success("Job form content updated successfully!");
                handleGetContent();
            }
        } catch (error) {
            console.error("Error updating job form content");
            toast.error("An error occurred while updating content");
        } finally {
            setLoading(false);
        }
    };

    const handleGetContent = async () => {
        try {
            setLoading(true);
            const response = await JobFormContentApi.getContent();
            if (response.remote === "success") {
                const data = response.data?.data[0];
                setData({
                    ...data,
                    coverLetter: data.coverLetter || "",
                });
            }

        } catch (error) {
            console.error("Error fetching content:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleGetContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AddCityStyled>
            <ToastContainer />
            <MainLayout>
                <Box sx={{ paddingLeft: "260px" }} className="addNew">
                    <Box p={3}>
                        <Box className="headerCompany">
                            <h3>Manage Begleitschreiben</h3>
                        </Box>
                        <Box className="companyBox">
                            <Box className="customLabel">
                                <label>Cover Letter</label>
                                <QuillEditor
                                    onChange={(e: any) => {
                                        setData((prev: any) => ({
                                            ...prev,
                                            ["coverLetter"]: e,
                                        }));
                                    }}
                                    value={data.coverLetter}
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
        </AddCityStyled>
    )
}