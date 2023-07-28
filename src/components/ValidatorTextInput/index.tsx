import { TextInputProps } from "react-native";
import { combineStyles } from "../../helpers/styleHelpers";
import { TStyleSheet, onFocusStyleProps } from "../../types/commonTypes";
import CustomTextInput from "../CustomTextInput";
import Style from "./ValidatorTextInput.style";

interface ValidatorTextInputProps {
  isDataOK: boolean;
  activateSublabel: boolean;
  showSublabel: boolean;
  sublabel?: string;
  customSublabelStyle?: TStyleSheet;
  textInputProps?: TextInputProps;
  onFocusStyleProps?: onFocusStyleProps;
}

const ValidatorTextInput: React.FC<ValidatorTextInputProps> = ({
  isDataOK,
  activateSublabel,
  showSublabel,
  sublabel,
  customSublabelStyle,
  textInputProps,
  onFocusStyleProps,
}) => {
  const combinedSublabelStyle = combineStyles(Style(isDataOK).sublabel, customSublabelStyle);

  return (
    <CustomTextInput
      activateSublabel={activateSublabel}
      showSublabel={showSublabel}
      sublabel={sublabel || "Sublabel"}
      customSublabelStyle={combinedSublabelStyle}
      textInputProps={textInputProps}
      onFocusStyleProps={onFocusStyleProps}
    />
  );
};

export default ValidatorTextInput;
