"use client";
import MainLayout from "@/components/layout";
import React, { useState } from "react";
import { Box } from "@mui/material";
import { SVG } from "@/assets/svg";
import TextInput from "@/components/labelInput";
import FilledButton from "@/components/button";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddCityStyled from "./addCityStyled";
import { CompanyApi } from "@/pages/api/company/CompanyApi";

export default function AddCity() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [loading, setLoading] = useState(false);
  const [cityData, setCityData] = useState({
    name: "",
    address: "",
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { name, address } = cityData;

      if (!name || !address) {
        toast.error("Name and address are required.");
        return;
      }
      const payload: any = { name, address, companyId: id };

      const response = await CompanyApi.addCity(payload);
      if (response.remote === "success") {
        toast.success("City added successfully!");
        router.push(`/manage-cities?id=${id}`);
      }
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("An error occurred while updating city.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCityData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGoBack = () => {
    router.back(); // This will navigate to the previous page
  };

  return (
    <AddCityStyled>
      <ToastContainer />
      <MainLayout>
        <Box sx={{ paddingLeft: "260px" }} className="addNew">
          <Box p={3}>
            <Box className="headerCompany">
              <SVG.Arrow onClick={handleGoBack} style={{ cursor: "pointer" }} />
              <h3>Add City</h3>
            </Box>
            <Box className="companyBox">
              <Box className="customLabel">
                <label>City</label>
                <TextInput
                  name="name"
                  type="text"
                  placeholder="Enter city"
                  value={cityData.name}
                  onChange={handleChange}
                />
              </Box>
              <Box className="customLabel">
                <label>Address</label>
                <TextInput
                  name="address"
                  type="text"
                  placeholder="Enter address"
                  value={cityData.address}
                  onChange={handleChange}
                />
              </Box>

              <Box sx={{ textAlign: "end", paddingBottom: "22px" }}>
                <FilledButton
                  className="btnSubmit"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  <SVG.Vector /> {loading ? "Submitting..." : "Submit"}
                </FilledButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </MainLayout>
    </AddCityStyled>
  );
}
