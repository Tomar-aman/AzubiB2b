// components/TextInput.tsx
"use client";

import React, { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { SVG } from "@/assets/svg";

interface TextInputProps {
  type?: "text" | "password" | "email" | "number" | "file" | "date"; // Manage these types
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  name?: string;
  disabled?: boolean;
  autocomplete?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  type,
  value,
  placeholder,
  onChange,
  className,
  name,
  disabled,
  autocomplete,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const renderInputType = () => {
    if (type === "password") {
      return showPassword ? "text" : "password";
    }
    return type; // For 'text', 'email', 'number', or 'file'
  };

  return (
    <TextField
      className={className}
      placeholder={placeholder}
      variant="outlined"
      type={renderInputType()}
      value={type !== "file" ? value : undefined} // Value is not applicable for 'file' inputs
      onChange={onChange}
      name={name || ""}
      fullWidth
      InputProps={{
        endAdornment:
          type === "password" ? (
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowPassword} edge="end">
                {showPassword ? <SVG.EyeHide /> : <SVG.Eyes />}
              </IconButton>
            </InputAdornment>
          ) : null,
      }}
      disabled={disabled}
      autoComplete={autocomplete}
    />
  );
};

export default TextInput;
