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
import { JobAlarmContentApi } from "../api/alarmContent/AlarmContentApi";

export default function ManageJobAlarmContent() {
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [data, setData] = useState<{
        image: File | null;
        heading: string;
        text: string;
    }>({
        image: null,
        heading: "",
        text: ""
    });

    const handleImageUpload = (file: File | null) => {
        setData((prev) => ({
            ...prev,
            image: file,
        }));

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const { image, heading, text } = data;

            const response = await JobAlarmContentApi.addContent({
                image, heading, text
            });

            if (response.remote === "success") {
                toast.success("Job alarm content updated successfully!");
                handleGetContent();
            }
        } catch (error) {
            console.error("Error updating job alarm content");
            toast.error("An error occurred while updating content");
        } finally {
            setLoading(false);
        }
    };

    const handleGetContent = async () => {
        try {
            setLoading(true);
            const response = await JobAlarmContentApi.getContent();
            if (response.remote === "success") {
                const data = response.data?.data[0];
                setData({
                    ...data,
                    text: data.text || "",
                });
                setImagePreview(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/${data.image || ""}`,
                );
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
                            <h3>Manage Job Alarm Content</h3>
                        </Box>
                        <Box className="companyBox">
                            <Box className="customLabel">
                                <label>Image</label>
                                <UploadPicture
                                    value={imagePreview}
                                    onChange={handleImageUpload}
                                />
                            </Box>
                            <Box className="customLabel">
                                <label>Heading</label>
                                <TextInput
                                    name="heading"
                                    type="text"
                                    placeholder=""
                                    onChange={(e: any) => {
                                        setData((prev: any) => ({
                                            ...prev,
                                            ["heading"]: e.target.value,
                                        }));
                                    }}
                                    value={data.heading}
                                />
                            </Box>
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