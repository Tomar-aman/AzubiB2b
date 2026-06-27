import MainLayout from "@/components/layout";
import { Box } from "@mui/material";
import React from "react";

export default function TestPage() {
  return (
    <MainLayout>
      <Box className="noData">
        <h1>This is inactive. To activate, please contact the superadmin.</h1>
      </Box>
    </MainLayout>
  );
}
