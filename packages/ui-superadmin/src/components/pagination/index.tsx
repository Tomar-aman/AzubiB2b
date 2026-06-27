import React from "react";
import {
  Pagination,
  Select,
  MenuItem,
  Box,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import DashboardStyled from "@/pages/dashboard/dashboardStyled";
import FilledButton from "../button";

interface CustomPaginationProps {
  page: number;
  rowsPerPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  page,
  rowsPerPage,
  totalPages,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    onPageChange(value);
  };

  const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    onRowsPerPageChange(Number(event.target.value));
  };

  return (
    <DashboardStyled>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        margin="22px 0"
      >
        {/* Records per page select */}
        <Box display="flex" alignItems="center" className="selectBox">
          <Select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            variant="outlined"
            size="small"
            sx={{ marginRight: "8px" }}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
          </Select>
          <Typography>Records Per Page</Typography>
        </Box>

        {/* Pagination controls */}
        <Box display="flex" alignItems="center" className="paginationBox">
          <FilledButton
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            // sx={{ color: page === 1 ? '#b0b0b0' : '#009688', marginRight: '8px' }}
            className="nextBtn"
          >
            Previous
          </FilledButton>

          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            siblingCount={0}
            boundaryCount={1}
            color="primary"
            shape="rounded"
          />

          <FilledButton
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="prevBtn"
            // sx={{ color: page === totalPages ? '#b0b0b0' : '#009688', marginLeft: '8px' }}
          >
            Next
          </FilledButton>
        </Box>
      </Box>
    </DashboardStyled>
  );
};

export default CustomPagination;
