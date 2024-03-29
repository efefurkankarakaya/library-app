/* Core */
import { TextInputProps } from "react-native";

/* Custom Components */
import CustomTextInput from "../CustomTextInput";

/* Style */
import Style from "./index.style";

/* Types */
import { TStyleSheet, onFocusStyleProps } from "../../types/commonTypes";

/* Others */
import { combineStyles } from "../../helpers/styleHelpers";

interface ValidatorTextInputProps {
  label?: string;
  isDataOK: boolean;
  activateSublabel: boolean;
  showSublabel: boolean;
  sublabel?: string;
  customSublabelStyle?: TStyleSheet;
  customContainerStyle?: TStyleSheet;
  textInputProps?: TextInputProps;
  onFocusStyleProps?: onFocusStyleProps;
}

const ValidatorTextInput: React.FC<ValidatorTextInputProps> = ({
  label,
  isDataOK,
  activateSublabel,
  showSublabel,
  sublabel,
  customSublabelStyle,
  customContainerStyle,
  textInputProps,
  onFocusStyleProps,
}): JSX.Element => {
  const combinedSublabelStyle = combineStyles(Style(isDataOK).sublabel, customSublabelStyle);

  return (
    <CustomTextInput
      label={label}
      activateSublabel={activateSublabel}
      showSublabel={showSublabel}
      sublabel={sublabel || " "}
      customSublabelStyle={combinedSublabelStyle}
      customContainerStyle={customContainerStyle}
      textInputProps={textInputProps}
      onFocusStyleProps={onFocusStyleProps}
    />
  );
};

export default ValidatorTextInput;
