import * as React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { SVG } from "@/assets/svg";
import LoginsStyled from "@/pages/account-setting/settingStyled";

interface CheckboxLabelsProps {
  label?: string;
  title?: string;
  checked: boolean;
  onChange: () => void;
}

const CheckedIcon = () => <SVG.Check />;

const UncheckedIcon = () => <SVG.Uncheck />;

const CheckboxLabels: React.FC<CheckboxLabelsProps> = ({
  label,
  checked,
  onChange,
}) => {
  return (
    <LoginsStyled>
      <FormGroup className="checkBox">
        <FormControlLabel
          control={
            <Checkbox
              icon={<UncheckedIcon />}
              checkedIcon={<CheckedIcon />}
              checked={checked ? false : true}
              onChange={onChange}
            />
          }
          label={label}
        />
      </FormGroup>
    </LoginsStyled>
  );
};

export default CheckboxLabels;
