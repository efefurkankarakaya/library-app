import { useState } from "react";
import { SafeAreaView, Text, TextInput, TextProps } from "react-native";
import Style from "./CustomText.style";
import CustomText from "../CustomText";
import { combineStyles } from "../../helpers/styleHelpers";
import { TStyleSheet } from "../../types/commonTypes";
import { TextInputProps } from "react-native";

// type TKeyboardType = "default" | "number-pad" | "decimal-pad" | "numeric" | "email-address" | "phone-pad" | "url";

interface CustomTextInputProps {
  label?: string;
  customContainerStyle?: TStyleSheet;
  customLabelStyle?: TStyleSheet;
  customTextInputStyle?: TStyleSheet;
  textProps?: TextProps;
  textInputProps?: TextInputProps;
}

const CustomTextInput = ({
  label,
  customContainerStyle,
  customLabelStyle,
  customTextInputStyle,
  textProps,
  textInputProps,
}: CustomTextInputProps) => {
  const [text, onChangeText] = useState("");

  const combinedContainerStyle: TStyleSheet = combineStyles(Style.container, customContainerStyle);
  const combinedLabelStyle: TStyleSheet = combineStyles(Style.label, customLabelStyle);
  const combinedTextInputStyle: TStyleSheet = combineStyles(Style.textInput, customTextInputStyle);

  return (
    <SafeAreaView style={combinedContainerStyle}>
      <CustomText customTextStyle={combinedLabelStyle} {...textProps}>
        {label}
      </CustomText>
      <TextInput
        style={combinedTextInputStyle}
        onChangeText={onChangeText}
        value={text}
        autoCapitalize="none"
        autoComplete="off"
        maxLength={32}
        {...textInputProps}
      />
    </SafeAreaView>
  );
};

export default CustomTextInput;
