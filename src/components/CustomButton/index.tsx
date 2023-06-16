import React, { ReactNode } from "react";
import { SafeAreaView, TextProps, TouchableOpacity, TouchableOpacityProps } from "react-native";

import CustomText from "../CustomText";

import Style from "./CustomButton.style";
import { TStyleSheet } from "../../types/commonTypes";
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
