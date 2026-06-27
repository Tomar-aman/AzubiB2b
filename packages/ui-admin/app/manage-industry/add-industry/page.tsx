"use client";
import MainLayout from "@/components/layout";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { SVG } from "@/assets/svg";
import TextInput from "@/components/labelInput";
import FilledButton from "@/components/button";
import { useRouter, useSearchParams } from "next/navigation";
import AddIndustryStyled from "./addindustryStyled";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IndustryApi } from "@/app/api/industry/IndustryApi";
import { useAppSelector } from "@monorepo/ui-core/src/redux/hooks";

export default function AddIndustry() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { company } = useAppSelector((state) => state.globalCache);

  const [loading, setLoading] = useState(false);
  const [industry, setIndustry] = useState({
    industryName: "",
  });

  const handleGetIndustry = async (id: string) => {
    try {
      setLoading(true);
      const response = await IndustryApi.getIndustry(id);

      if (response.remote === "success") {
        const data = response.data.data;
        setIndustry({
          ...industry,
          industryName: data.industryName || "",
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
    setIndustry((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { industryName } = industry;

      if (!industryName) {
        toast.error("Industry name is required.");
        return;
      }

      if (id) {
        const response = await IndustryApi.updateIndustry(id as string, {
          industryName,
        });

        if (response.remote === "success") {
          toast.success("Industry updated successfully!");
          router.push("/manage-industry");
        }
      } else {
        const response = await IndustryApi.addIndustry({
          companyId: company._id,
          industryName,
        });

        if (response.remote === "success") {
          toast.success("Industry added successfully!");
          router.push("/manage-industry");
        }
      }
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("An error occurred while updating industry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && typeof id === "string") {
      handleGetIndustry(id);
    } else {
      console.error("Invalid city ID");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleGoBack = () => {
    router.back(); // This will navigate to the previous page
  };

  return (
    <AddIndustryStyled>
      <ToastContainer />
      <MainLayout>
        <Box sx={{ paddingLeft: "260px" }} className="addNew">
          <Box p={3}>
            <Box className="headerCompany">
              <SVG.Arrow onClick={handleGoBack} style={{ cursor: "pointer" }} />
              <h3>Add Industry</h3>
            </Box>
            <Box className="companyBox">
              <Box className="customLabel">
                <label>Name</label>
                <TextInput
                  name="industryName"
                  type="text"
                  placeholder="Enter industry"
                  value={industry.industryName}
                  onChange={handleChange}
                />
              </Box>

              <Box sx={{ textAlign: "end", paddingBottom: "22px" }}>
                {/* <Link href="/manage-industry"> */}{" "}
                <FilledButton
                  className="btnSubmit"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  <SVG.Vector /> Submit
                </FilledButton>
                {/* </Link> */}
              </Box>
            </Box>
          </Box>
        </Box>
      </MainLayout>
    </AddIndustryStyled>
  );
}
