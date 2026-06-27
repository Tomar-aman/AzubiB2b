import * as React from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { SVG } from "@/assets/svg";
import { InputLabel } from "@mui/material";

interface BasicSelectProps {
  items: { value: number; label: string }[];
  className?: string;
  multiple?: boolean;
  placeholder?: string;
  onValueChange?: any;
  value?: string | number | (string | number)[];
  labels?: string;
  disabled?: boolean;
}

const BasicSelect: React.FC<BasicSelectProps> = ({
  items,
  className,
  multiple,
  labels,
  placeholder,
  onValueChange,
  disabled = false,
  value: propValue,
  ...rest
}) => {
  const [internalValue, setInternalValue] = React.useState<
    string | number | (string | number)[]
  >(multiple ? [] : "");

  const value = propValue !== undefined ? propValue : internalValue;

  const handleChange = (event: SelectChangeEvent<typeof value>) => {
    if (disabled) return;

    const newValue = multiple
      ? (event.target.value as (string | number)[])
      : (event.target.value as string | number);
    setInternalValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <Box sx={{ width: "100%" }} className="selectFloating">
      <FormControl fullWidth className={className}>
        <InputLabel sx={{ color: "#000", opacity: "0.5" }}>{labels}</InputLabel>
        <Select
          {...rest}
          multiple={multiple}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          displayEmpty
          IconComponent={() => <SVG.Down />}
        >
          <MenuItem value="" disabled>
            {placeholder || ""}{" "}
          </MenuItem>
          {items.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default BasicSelect;
