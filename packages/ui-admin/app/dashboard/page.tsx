"use client";
import MainLayout from "@/components/layout";
import React from "react";
import { Box, Typography } from "@mui/material";
import DashboardStyled from "./dashboardStyled";
import Grid from "@mui/material/Grid2";

function Dashboard() {
  return (
    <DashboardStyled>
      <MainLayout>
        <Box className="dashboardContent">
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }} className="title">
              Dashboard
            </Typography>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Box className="dashboardcard">
                  <h2>Job Listings</h2>
                  <span>XX</span>
                </Box>
              </Grid>
              <Grid size={6}>
                <Box className="dashboardcard">
                  <h2>Content Updates</h2>
                  <span>XX</span>
                </Box>
              </Grid>
              <Grid size={2.2}></Grid>
              <Grid size={7.6}>
                <Box className="dashboardcard">
                  <h2>Candidate Engagement</h2>
                  <span>XX</span>
                </Box>
              </Grid>
              <Grid size={2.2}></Grid>
            </Grid>
          </Box>
        </Box>
      </MainLayout>
    </DashboardStyled>
  );
}
export default Dashboard;
