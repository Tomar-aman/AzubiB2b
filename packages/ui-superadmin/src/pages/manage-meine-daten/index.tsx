import { SVG } from "@/assets/svg";
import FilledButton from "@/components/button";
import MainLayout from "@/components/layout";
import QuillEditor from "@/components/textarea";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddCityStyled from "../manage-cities/add-city/addCityStyled";
import { MeineDatenApi } from "../api/meineDaten/MeineDatenApi";

export default function ManageMeineDaten() {
    const [data, setData] = useState({ text: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const { text } = data;

            const response = await MeineDatenApi.addBottomText({ text });

            if (response.remote === "success") {
                toast.success("Text updated successfully!");
            }
        } catch (error) {
            console.error("Error updating text:", error);
            toast.error("An error occurred while updating text.");
        } finally {
            setLoading(false);
        }
    };

    const handleGetContent = async () => {
        try {
            setLoading(true);
            const response = await MeineDatenApi.getBottomText();
            if (response.remote === "success") {
                const data = response.data?.data[0];
                setData({
                    ...data,
                    text: data.text || "",
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
        <AddCityStyled>
            <ToastContainer />
            <MainLayout>
                <Box sx={{ paddingLeft: "260px" }} className="addNew">
                    <Box p={3}>
                        <Box className="headerCompany">
                            <h3>Manage Meine Daten</h3>
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
        </AddCityStyled>
    )
}