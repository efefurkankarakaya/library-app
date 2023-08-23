/* Core */
import React, { ReactNode } from "react";
import { SafeAreaView, TextProps, TouchableOpacity, TouchableOpacityProps } from "react-native";

/* Custom Components */
import CustomText from "../CustomText";

/* Style */
import Style from "./index.style";

/* Types */
import { TStyleSheet } from "../../types/commonTypes";

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
