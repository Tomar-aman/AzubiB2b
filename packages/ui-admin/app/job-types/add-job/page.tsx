"use client";
import MainLayout from "@/components/layout";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { SVG } from "@/assets/svg";
import TextInput from "@/components/labelInput";
import FilledButton from "@/components/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AddJobStyled from "./addjobStyled";
import { JobTypeApi } from "@/app/api/jobtype/JobTypeApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppSelector } from "@monorepo/ui-core/src/redux/hooks";

export default function AddRegion() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { company } = useAppSelector((state) => state.globalCache);

  const [loading, setLoading] = useState(false);
  const [jobType, setJobType] = useState({
    jobTypeName: "",
  });

  const handleGetJobType = async (id: string) => {
    try {
      setLoading(true);
      const response = await JobTypeApi.getJobType(id);

      if (response.remote === "success") {
        const data = response.data.data;
        setJobType({
          ...jobType,
          jobTypeName: data.jobTypeName || "",
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
    setJobType((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { jobTypeName } = jobType;
      if (!jobTypeName) {
        toast.error("JobType name is required.");
        return;
      }

      if (id) {
        const response = await JobTypeApi.updateJobType(id as string, {
          jobTypeName,
        });

        if (response.remote === "success") {
          toast.success("Company updated successfully!");
          router.push("/job-types");
        }
      } else {
        const response = await JobTypeApi.addJobType({
          companyId: company?._id,
          jobTypeName,
        });

        if (response.remote === "success") {
          toast.success("Company added successfully!");
          router.push("/job-types");
        }
      }
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("An error occurred while updating company.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && typeof id === "string") {
      handleGetJobType(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <AddJobStyled>
      <ToastContainer />
      <MainLayout>
        <Box sx={{ paddingLeft: "260px" }} className="addNew">
          <Box p={3}>
            <Box className="headerCompany">
              <SVG.Arrow onClick={handleGoBack} style={{ cursor: "pointer" }} />
              <h3>Add Job Type</h3>
            </Box>
            <Box className="companyBox">
              <Box className="customLabel">
                <label>Name</label>
                <TextInput
                  name="jobTypeName"
                  type="text"
                  placeholder="Enter job type"
                  value={jobType.jobTypeName}
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
    </AddJobStyled>
  );
}
