/* Core */
import React from "react";
import { TouchableOpacity } from "react-native";

/* Custom Components */
import CustomText from "../CustomText";

/* Style */
import Style from "./index.style";

/* Others */
import { combineStyles } from "../../helpers/styleHelpers";
import { CustomButtonProps } from "../../types/componentProps";

const CustomButton = ({ children, buttonStyle, textStyle, touchableOpacityProps, textProps }: CustomButtonProps) => {
  const combinedButtonStyle = combineStyles(Style.button, buttonStyle);
  const combinedTextStyle = combineStyles(Style.text, textStyle);

  return (
    <TouchableOpacity style={combinedButtonStyle} {...touchableOpacityProps}>
      <CustomText textStyle={combinedTextStyle} {...textProps}>
        {children}
      </CustomText>
    </TouchableOpacity>
  );
};

export default CustomButton;
