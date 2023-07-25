import { TextInputProps } from "react-native";
import { combineStyles } from "../../helpers/styleHelpers";
import { TStyleSheet } from "../../types/commonTypes";
import CustomTextInput from "../CustomTextInput";
import Style from "./ValidatorTextInput.style";

interface ValidatorTextInputProps {
  isDataOK: boolean;
  activateSublabel: boolean;
  showSublabel: boolean;
  sublabel?: string;
  customSublabelStyle?: TStyleSheet;
  textInputProps?: TextInputProps;
}

const ValidatorTextInput: React.FC<ValidatorTextInputProps> = ({
  isDataOK,
  activateSublabel,
  showSublabel,
  sublabel,
  customSublabelStyle,
  textInputProps,
}) => {
  const combinedSublabelStyle = combineStyles(Style(isDataOK).sublabel, customSublabelStyle);
  console.log(combinedSublabelStyle);

  return (
    <CustomTextInput
      activateSublabel={activateSublabel}
      showSublabel={showSublabel}
      sublabel={sublabel || "Sublabel"}
      customSublabelStyle={combinedSublabelStyle}
      textInputProps={textInputProps}
    />
  );
};

export default ValidatorTextInput;
