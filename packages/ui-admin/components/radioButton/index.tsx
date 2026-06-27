import React from "react";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

interface CustomRadioButtonProps {
  value: string;
  label: string;
  className?: string;
  selectedValue: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomRadioButton: React.FC<CustomRadioButtonProps> = ({
  value,
  label,
  className,
  selectedValue,
  onChange,
}) => {
  return (
    <FormControl className={className}>
      <FormControlLabel
        value={value}
        control={
          <Radio checked={selectedValue === value} onChange={onChange} />
        }
        label={label}
      />
    </FormControl>
  );
};

export default CustomRadioButton;
