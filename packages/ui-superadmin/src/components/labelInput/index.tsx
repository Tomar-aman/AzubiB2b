// components/TextInput.tsx
import React, { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { SVG } from "@/assets/svg";

interface TextInputProps {
  type?: "text" | "password";
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  className?: string; // Added className to the props
  name?: string;
  disabled?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  type,
  value,
  placeholder,
  onChange,
  className,
  name,
  disabled
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <TextField
      className={className}
      placeholder={placeholder}
      variant="outlined"
      type={type === "password" && !showPassword ? "password" : "text"}
      value={value}
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
    />
  );
};

export default TextInput;
