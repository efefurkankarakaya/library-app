import { useState } from "react";
import { SafeAreaView, Text, TextInput } from "react-native";
import Style from "./CustomText.style";
import CustomText from "../CustomText";
import { combineStyles } from "../../helpers/styleHelpers";
import { TStyleSheet } from "../../types/commonTypes";

// type TKeyboardType = "default" | "number-pad" | "decimal-pad" | "numeric" | "email-address" | "phone-pad" | "url";

interface CustomTextInputProps {
  label: string;
  customContainerStyle?: TStyleSheet;
  customLabelStyle?: TStyleSheet;
  customTextInputStyle?: TStyleSheet;
}

const CustomTextInput = ({
  label,
  customContainerStyle,
  customLabelStyle,
  customTextInputStyle,
  ...textInputProps
}: CustomTextInputProps) => {
  const [text, onChangeText] = useState("");

  const combinedContainerStyle: TStyleSheet = combineStyles(Style.container, customContainerStyle);
  const combinedLabelStyle: TStyleSheet = combineStyles(Style.label, customLabelStyle);
  const combinedTextInputStyle: TStyleSheet = combineStyles(Style.textInput, customTextInputStyle);

  return (
    <SafeAreaView style={combinedContainerStyle}>
      <CustomText customTextStyle={combinedLabelStyle}>{label}</CustomText>
      <TextInput style={combinedTextInputStyle} onChangeText={onChangeText} value={text} {...textInputProps} />
    </SafeAreaView>
  );
};

export default CustomTextInput;
