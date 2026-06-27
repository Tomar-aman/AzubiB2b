import { Box } from '@mui/material';
import React, { ReactNode } from 'react';
import Header from './header';
import Sidebar from './sidebar';

// Define the interface for the props
interface MainLayoutProps {
    children: ReactNode; // ReactNode allows any valid React child (string, number, component, etc.)
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <>
            <Box className="dashboardLayout">
                <Sidebar />
                <Header />
                <Box className="childDashboard">
                    {children}
                </Box>
            </Box>

        </>
    );
};

export default MainLayout;
