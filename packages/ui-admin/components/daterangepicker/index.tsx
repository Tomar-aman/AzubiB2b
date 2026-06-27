"use client";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DatepickerStyled from "./datepickerStyled";

interface DatepickerProps {
  onDateChange?: (dateRange: [Date | null, Date | null]) => void; // Callback to notify parent
}

const Datepicker: React.FC<DatepickerProps> = ({ onDateChange }) => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;

  const handleDateChange = (update: [Date | null, Date | null]) => {
    setDateRange(update);
    if (onDateChange) {
      onDateChange(update); // Notify parent
    }
  };

  return (
    <DatepickerStyled>
      <DatePicker
        placeholderText="Select Date"
        selectsRange={true}
        startDate={startDate || undefined}
        endDate={endDate || undefined}
        onChange={handleDateChange}
        isClearable={true}
      />
    </DatepickerStyled>
  );
};

export default Datepicker;
