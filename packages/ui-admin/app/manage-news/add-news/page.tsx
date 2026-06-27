"use client"
import MainLayout from "@/components/layout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SidebarStyled from "../../manage-sidebar/sidebarStyled";
import { Box } from "@mui/material";
import TextInput from "@/components/labelInput";
import FilledButton from "@/components/button";
import { SVG } from "@/assets/svg";
import QuillEditor from "@/components/textarea";
import { useEffect, useState } from "react";
import MultipleUploadPicture from "@/components/multipleUploadfile";
import { NewsApi } from "../../api/news/NewsApi";
import { useRouter, useSearchParams } from "next/navigation";

export default function AddNews() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [loading, setLoading] = useState(false);
    const [existingServerImages, setExistingServerImages] = useState<any[]>([]);
    const [newFilesToUpload, setNewFilesToUpload] = useState<File[]>([]);
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
    const [news, setNews] = useState({
        _id: "",
        title: "",
        description: "",
        images: []
    });
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNews((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (files: File[] | null, existingImages: string[]) => {
        if (files && files.length > 0) {
            setNewFilesToUpload(files);

            // Create previews for the new files
            const previews: string[] = [];
            let loaded = 0;

            files.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    previews.push(reader.result as string);
                    loaded++;

                    if (loaded === files.length) {
                        setNewImagePreviews(previews);
                    }
                };
                reader.readAsDataURL(file);
            });
        } else {
            setNewFilesToUpload([]);
            setNewImagePreviews([]);
        }
    };

    const handleFetchNews = async (id: string) => {
        try {
            setLoading(true);
            const response: any = await NewsApi.getNewsData(id);
            if (response?.remote === "success") {
                const data = response.data.data
                setNews(data);
                if (Array.isArray(data.images) && data.images.length > 0) {
                    setExistingServerImages(data.images);
                } else {
                    setExistingServerImages([]);
                }
            }
        } catch (error) {
            console.error("Error fetching company data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const { title, description } = news;
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("existingImages", JSON.stringify(existingServerImages));

            // Append only NEW files
            if (newFilesToUpload && newFilesToUpload.length > 0) {
                newFilesToUpload.forEach((file: File) => {
                    formData.append("images[]", file);
                });
            };

            if (id) {
                const response = await NewsApi.updateNews(id, formData as any);
                if (response.remote === "success") {
                    toast.success("News updated successfully!");
                    router.push("/manage-news");
                } else {
                    toast.error("Maximum 3 images allowed")
                }
            } else {
                const response = await NewsApi.addNews(formData);
                if (response.remote === "success") {
                    toast.success("News added successfully!");
                    router.push("/manage-news");
                } else {
                    toast.error("Maximum 3 images allowed")
                }
            }
        } catch (error) {
            console.error("Error adding news:", error);
            toast.error("An error occurred while adding news.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            handleFetchNews(id);
        }
    }, [id]);

    // Create image preview URLs for the child component
    const imagePreviewUrls = [
        ...existingServerImages.map((img: any) => `${baseURL}${img.file}`),
        ...newImagePreviews,
    ];

    return (
        <SidebarStyled>
            <ToastContainer />
            <MainLayout>
                <Box sx={{ paddingLeft: "260px" }} className="addNew">
                    <Box p={3}>
                        <Box className="headerCompany">
                            <h3>Manage News</h3>
                        </Box>
                        <Box className="companyBox">
                            <Box className="imageText">
                                <label
                                    style={{
                                        width: "181px",
                                        marginRight: "20px",
                                        alignItems: "center",
                                    }}
                                >
                                    Title
                                </label>
                                <TextInput
                                    type="text"
                                    className="inputTips"
                                    name="title"
                                    onChange={handleChange}
                                    value={news.title}
                                />
                            </Box>
                            <Box className="customLabel">
                                <label>Description</label>
                                <QuillEditor
                                    onChange={(e: any) => {
                                        setNews((prev: any) => ({
                                            ...prev,
                                            ["description"]: e,
                                        }));
                                    }}
                                    value={news.description}
                                />
                            </Box>
                            <Box className="customLabel">
                                <Box
                                    className="imageText"
                                    style={{ display: "flex", alignItems: "center" }}
                                >
                                    <label>Images</label>
                                    <MultipleUploadPicture
                                        value={imagePreviewUrls}
                                        onChange={handleFileChange}
                                        newsId={news._id}
                                        existingServerImages={existingServerImages}
                                        onExistingImagesChange={setExistingServerImages}
                                    />
                                </Box>
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
    )
}