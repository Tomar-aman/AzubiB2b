/* eslint-disable @next/next/no-img-element */
"use client";
import MainLayout from "@/components/layout";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { SVG } from "@/assets/svg";
import TextInput from "@/components/labelInput";
import FilledButton from "@/components/button";
import { useRouter, useSearchParams } from "next/navigation";
import AddMenuStyled from "./addmenuStyled";
import ColorPicker from "@/components/colorpicker";
import { Sidemenu } from "@/app/api/sidemenu/SidemenuApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BasicSelect from "@/components/selectdropdown";

export default function AddNewCompany() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const id = searchParams.get("id");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [sidemenu, setSidemenu] = useState<{
    icon: string;
    name: string;
    url: string;
    color: string;
  }>({
    icon: "",
    name: "",
    url: "",
    color: "",
  });
  const router = useRouter();
  const [iconList, setIconList] = useState<any>([]);

  const handleGoBack = () => {
    router.back();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSidemenu((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleColorChange = (color: string) => {
    setSidemenu((prev: any) => ({
      ...prev,
      ["color"]: color,
    }));
  };

  const handleGetIcons = async () => {
    setLoading(true);
    const response: any = await Sidemenu.getIcons();

    if (response?.remote === "success") {
      const formattedIcons = response.data.data.map((item: any) => ({
        value: item.icon, // Save only the path
        label: item.icon, // Optional, in case you want a text label
        preview: `${process.env.NEXT_PUBLIC_API_BASE_URL}/${item.icon}`, // Full image URL for preview
      }));

      setIconList(formattedIcons);
    } else {
      return response?.error;
    }
  };

  useEffect(() => {
    handleGetIcons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetSideMenu = async (id: string) => {
    try {
      setLoading(true);
      const response = await Sidemenu.getSidemenuData(id);

      if (response.remote === "success") {
        const data = response.data.data;
        setSidemenu({
          ...sidemenu,
          icon: data.icon || "",
          name: data.name || "",
          url: data.url || "",
          color: data.color || "",
        });
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id && typeof id === "string") {
      handleGetSideMenu(id);
    } else {
      console.error("Invalid city ID");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { icon, name, url, color } = sidemenu;
      if (!name) {
        toast.error("Headline is required");
        return;
      }
      if (!url) {
        toast.error("Url is required");
        return;
      }
      if (!icon) {
        toast.error("Icon is required");
        return;
      }
      if (!color) {
        toast.error("Color is required");
        return;
      }
      if (id) {
        const response = await Sidemenu.updateSideMenuContent(id as string, {
          icon,
          name,
          url,
          color,
        });

        if (response.remote === "success") {
          toast.success("SideMenu updated successfully!");
          router.push("/side-menu-content");
        }
      } else {
        const response = await Sidemenu.addSideMenuContent({
          icon,
          name,
          url,
          color,
        });
        if (response.remote === "success") {
          toast.success("SideMenu added successfully!");
          router.push("/side-menu-content");
        }
      }
    } catch (error) {
      console.error("Error updating SideMenu:", error);
      toast.error("An error occurred while updating company.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AddMenuStyled>
      <ToastContainer />
      <MainLayout>
        <Box sx={{ paddingLeft: "260px" }} className="addNew">
          <Box p={3}>
            <Box className="headerCompany">
              <SVG.Arrow onClick={handleGoBack} style={{ cursor: "pointer" }} />
              <h3>{id ? "Update Side Menu" : "Add Side Menu"}</h3>
            </Box>
            <Box className="companyBox">
              <Box className="customLabel">
                <label>Headline</label>
                <TextInput
                  type="text"
                  name="name"
                  onChange={handleChange}
                  placeholder="Headline"
                  value={sidemenu.name}
                />
              </Box>
              <Box className="customLabel">
                <label>URL</label>
                <TextInput
                  type="text"
                  placeholder="Enter url"
                  name="url"
                  onChange={handleChange}
                  value={sidemenu.url}
                />
              </Box>
              <Box className="selectLabel">
                <label>Icon</label>
                <BasicSelect
                  items={iconList.map((item: any) => ({
                    value: item.value, // Save only the path
                    label: (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <img
                          src={item.preview}
                          alt="icon"
                          width={24}
                          height={24}
                        />
                        {/* {item.preview} */}
                      </div>
                    ),
                  }))}
                  className="my-select"
                  placeholder="Select"
                  multiple={false}
                  value={sidemenu.icon}
                  onValueChange={(e: any) => {
                    const selectedIcon = iconList.find(
                      (item: any) => item.value === e,
                    );
                    setSidemenu((prev) => ({
                      ...prev,
                      icon: e,
                    }));
                    setImagePreview(selectedIcon?.preview || null);
                  }}
                />
              </Box>
              <Box className="imageText" style={{ marginTop: "24px" }}>
                <label style={{ width: "181px" }}>Text Color</label>
                <ColorPicker
                  value={sidemenu.color}
                  onColorChange={handleColorChange}
                />
              </Box>

              <Box sx={{ textAlign: "end", paddingBottom: "22px" }}>
                {" "}
                <FilledButton
                  className="btnSubmit"
                  onClick={handleSubmit}
                  // disabled={loading}
                >
                  <SVG.Vector /> Submit
                </FilledButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </MainLayout>
    </AddMenuStyled>
  );
}
