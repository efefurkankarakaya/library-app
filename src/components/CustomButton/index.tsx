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

interface CustomButtonProps {
  children?: ReactNode;
  customTextStyle?: TStyleSheet;
  customButtonStyle?: TStyleSheet;
  touchableOpacityProps?: TouchableOpacityProps;
  textProps?: TextProps;
}

const CustomButton = ({ children, customButtonStyle, customTextStyle, touchableOpacityProps, textProps }: CustomButtonProps) => {
  const combinedButtonStyle = combineStyles(Style.button, customButtonStyle);
  const combinedTextStyle = combineStyles(Style.text, customTextStyle);

  return (
    <TouchableOpacity style={combinedButtonStyle} {...touchableOpacityProps}>
      <CustomText customTextStyle={combinedTextStyle} {...textProps}>
        {children}
      </CustomText>
    </TouchableOpacity>
  );
};

export default CustomButton;
