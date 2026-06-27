"use client";
import MainLayout from "@/components/layout";
import React from "react";
import { Box } from "@mui/material";
import { SVG } from "@/assets/svg";
import TextInput from "@/components/labelInput";
import FilledButton from "@/components/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AddRegionStyled from "./addregionStyled";

export default function AddRegion() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back(); // This will navigate to the previous page
  };

  return (
    <AddRegionStyled>
      <MainLayout>
        <Box sx={{ paddingLeft: "260px" }} className="addNew">
          <Box p={3}>
            <Box className="headerCompany">
              <SVG.Arrow onClick={handleGoBack} style={{ cursor: "pointer" }} />
              <h3>Add Region</h3>
            </Box>
            <Box className="companyBox">
              <Box className="customLabel">
                <label>Region Name</label>
                <TextInput type="text" placeholder="Enter region name" />
              </Box>

              <Box sx={{ textAlign: "end", paddingBottom: "22px" }}>
                <Link href="/account-setting">
                  {" "}
                  <FilledButton className="btnSubmit">
                    <SVG.Vector /> Submit
                  </FilledButton>
                </Link>
              </Box>
            </Box>
          </Box>
        </Box>
      </MainLayout>
    </AddRegionStyled>
  );
}
