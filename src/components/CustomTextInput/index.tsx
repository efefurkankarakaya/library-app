import { useState } from "react";
import { NativeSyntheticEvent, SafeAreaView, Text, TextInput, TextInputChangeEventData, TextProps } from "react-native";
import Style from "./CustomText.style";
import CustomText from "../CustomText";
import { combineStyles } from "../../helpers/styleHelpers";
import { TStyleSheet } from "../../types/commonTypes";
import { TextInputProps } from "react-native";

// type TKeyboardType = "default" | "number-pad" | "decimal-pad" | "numeric" | "email-address" | "phone-pad" | "url";

interface CustomTextInputProps {
  label?: string;
  sublabel?: string;
  activateSublabel?: boolean;
  showSublabel?: boolean;
  customContainerStyle?: TStyleSheet;
  customLabelStyle?: TStyleSheet;
  customSublabelStyle?: TStyleSheet;
  customTextInputStyle?: TStyleSheet;
  textProps?: TextProps;
  textInputProps?: TextInputProps;
}

const CustomTextInput = ({
  label,
  sublabel,
  activateSublabel,
  showSublabel,
  customContainerStyle,
  customLabelStyle,
  customSublabelStyle,
  customTextInputStyle,
  textProps,
  textInputProps,
}: CustomTextInputProps) => {
  const [text, setText] = useState<string>("");

  const combinedContainerStyle: TStyleSheet = combineStyles(Style.container, customContainerStyle);
  const combinedLabelStyle: TStyleSheet = combineStyles(Style.label, customLabelStyle);
  const combinedSublabelStyle: TStyleSheet = combineStyles(Style.sublabel, customSublabelStyle);
  const combinedTextInputStyle: TStyleSheet = combineStyles(Style.textInput, customTextInputStyle);

  // const onChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => setText(event.nativeEvent.text);
  const onChangeText = (content: string) => setText(content);

  return (
    <SafeAreaView style={combinedContainerStyle}>
      <CustomText customTextStyle={combinedLabelStyle} {...textProps}>
        {label}
      </CustomText>
      <TextInput
        style={combinedTextInputStyle}
        // onChange={onChange}
        onChangeText={onChangeText}
        value={text}
        autoCapitalize="none"
        autoComplete="off"
        maxLength={32}
        {...textInputProps}
      />
      {activateSublabel && <CustomText customTextStyle={combinedSublabelStyle}>{showSublabel && sublabel}</CustomText>}
    </SafeAreaView>
  );
};

export default CustomTextInput;
