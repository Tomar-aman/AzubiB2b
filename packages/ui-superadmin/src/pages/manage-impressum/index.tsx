import { SVG } from "@/assets/svg";
import FilledButton from "@/components/button";
import MainLayout from "@/components/layout";
import QuillEditor from "@/components/textarea";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddCityStyled from "../manage-cities/add-city/addCityStyled";
import { CompanyApi } from "../api/company/CompanyApi";

export default function ManageImpressum() {
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

            const response = await CompanyApi.addImpressumContent({
                description: cleanDescription,
            });

            if (response.remote === "success") {
                toast.success("Impressum  updated successfully!");
            }
        } catch (error) {
            console.error("Error updating impressum :", error);
            toast.error("An error occurred while updating impressum.");
        } finally {
            setLoading(false);
        }
    };

    const handleGetContent = async () => {
        try {
            setLoading(true);
            const response = await CompanyApi.getImpressumData();
            if (response.remote === "success") {
                const data = response.data.data;
                setData({
                    ...data,
                    description: data[0].description || "",
                });
            }
        } catch (error) {
            console.error("Error fetching impressum:", error);
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
                            <h3>Manage Impressum </h3>
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
        </AddCityStyled>
    )
}