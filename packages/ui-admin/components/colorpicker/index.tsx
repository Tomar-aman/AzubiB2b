// components/ColorPicker.tsx
"use client";
import { SVG } from "@/assets/svg";
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { SketchPicker, ColorResult } from "react-color";

interface ColorPickerProps {
  onColorChange?: (color: string) => void; // Callback to return color to parent
  value?: any;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onColorChange, value }) => {
  const [show, setShow] = useState(false);
  const [colors, setColors] = useState<string[]>(["#4E3FF4"]);

  const handleChangeComplete = (colorResult: ColorResult) => {
    const newColor = colorResult.hex;
    if (!colors.includes(newColor)) {
      setColors([newColor]);
    }
    // Notify parent about the color change
    if (onColorChange) {
      onColorChange(newColor);
    }
  };
  useEffect(() => {
    if (value !== undefined) {
      setColors([value]); // Update local image state with value prop
    }
  }, [value]);
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      {/* Display Selected Colors */}
      {colors.map((color, index) => (
        <Box
          key={index}
          sx={{
            backgroundColor: color,
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "1px solid #ccc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      ))}

      {/* Picker Button */}
      <SVG.Picker onClick={() => setShow(!show)} />

      {/* SketchPicker */}
      {show && (
        <Box sx={{ position: "absolute", top: "50px", zIndex: 100 }}>
          <SketchPicker
            color={colors[colors.length - 1]}
            onChangeComplete={handleChangeComplete}
          />
        </Box>
      )}
    </Box>
  );
};

export default ColorPicker;
