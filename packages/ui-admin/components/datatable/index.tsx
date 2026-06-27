"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import TableStyled from "./tableStyled";

// Interface for a column
interface Column {
  label: React.ReactNode; // Label can be a string, number, or JSX
  field: string; // The field in data corresponding to this column
}

// Interface for table data
interface TableData {
  [key: string]: string | number | React.ReactNode | null;
}

// Props interface for TableComponent
interface TableComponentProps {
  columns: Column[]; // Array of columns
  data: TableData[]; // Array of data rows
}

const TableComponent: React.FC<TableComponentProps> = ({ columns, data }) => {
  return (
    <TableStyled>
      <TableContainer component={Paper} className="mainTable">
        <Table>
          <TableHead>
            <TableRow className="tableHead">
              {columns.map((col, index) => (
                <TableCell key={index}>{col.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody className="tbody">
            {data && data.length > 0 ?
              (data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <TableCell key={colIndex}>{row[col.field] || "-"}</TableCell>
                  ))}
                </TableRow>
              ))) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No data found
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </TableContainer>
    </TableStyled>
  );
};

export default TableComponent;
