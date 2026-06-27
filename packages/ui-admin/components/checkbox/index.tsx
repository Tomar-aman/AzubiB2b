import * as React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { SVG } from "@/assets/svg";
import LoginsStyled from "@/app/admin-setting/settingStyled";

interface CheckboxLabelsProps {
  label?: string;
  title?: string;
}

const CheckedIcon = () => <SVG.Check />;

const UncheckedIcon = () => <SVG.Uncheck />;

const CheckboxLabels: React.FC<CheckboxLabelsProps> = ({ label }) => {
  return (
    <LoginsStyled>
      <FormGroup className="checkBox">
        <FormControlLabel
          control={
            <Checkbox
              icon={<UncheckedIcon />}
              checkedIcon={<CheckedIcon />}
              defaultChecked
            />
          }
          label={label}
        />
      </FormGroup>
    </LoginsStyled>
  );
};

export default CheckboxLabels;
