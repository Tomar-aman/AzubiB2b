"use client";
import MainLayout from "@/components/layout";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { SVG } from "@/assets/svg";
import TextInput from "@/components/labelInput";
import FilledButton from "@/components/button";
import AddCityStyled from "./addcityStyled";
import { CityApi } from "../../api/city/CityApi";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppSelector } from "@monorepo/ui-core/src/redux/hooks";

export default function AddCity() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { company } = useAppSelector((state) => state.globalCache);

  const [loading, setLoading] = useState(false);
  const [cityData, setCityData] = useState({
    name: "",
    address: "",
  });

  const handleGetCity = async (id: string) => {
    try {
      setLoading(true);
      const response = await CityApi.getCityData(id);

      if (response.remote === "success") {
        const data = response.data.data;
        setCityData({
          ...cityData,
          name: data.name || "",
          address: data.address || "",
        });
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { name, address } = cityData;

      if (!name) {
        toast.error("Name is required.");
        return;
      }

      if (id) {
        const response = await CityApi.updateCityData(id as string, {
          name,
          address,
        });
        if (response.remote === "success") {
          toast.success("City updated successfully!");
          router.push("/manage-cities");
        }
      } else {
        const response = await CityApi.addCity({
          companyId: company?._id,
          name,
          address,
        });
        if (response.remote === "success") {
          toast.success("City added successfully!");
          router.push("/manage-cities");
        }
      }
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("An error occurred while updating city.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && typeof id === "string") {
      handleGetCity(id);
    } else {
      console.error("Invalid city ID");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
