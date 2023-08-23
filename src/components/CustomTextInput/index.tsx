/* Core */
import { useState } from "react";
import { NativeSyntheticEvent, Platform, SafeAreaView, TextInput, TextInputFocusEventData, TextProps, TextInputProps } from "react-native";

/* Custom Components */
import CustomText from "../CustomText";

/* Type */
/* https://stackoverflow.com/questions/61412000/do-i-need-to-use-the-import-type-feature-of-typescript-3-8-if-all-of-my-import */
import type { TStyleSheet, onFocusStyleProps } from "../../types/commonTypes";

/* Style */
import Style from "./index.style";
import { BorderColor, TextColor } from "../../common/colorPalette";

/* Others */
import { combineStyles } from "../../helpers/styleHelpers";

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
  onFocusStyleProps?: onFocusStyleProps;
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
  onFocusStyleProps,
}: CustomTextInputProps) => {
  const [text, setText] = useState<string>("");
  const [currentOnFocusStyle, setCurrentOnFocusStyle] = useState<onFocusStyleProps>({});

  const combinedContainerStyle: TStyleSheet = combineStyles(Style().container, customContainerStyle);
  const combinedLabelStyle: TStyleSheet = combineStyles(Style().label, customLabelStyle);
  const combinedSublabelStyle: TStyleSheet = combineStyles(Style().sublabel, customSublabelStyle);
  const combinedTextInputStyle: TStyleSheet = combineStyles(Style(currentOnFocusStyle).textInput, customTextInputStyle);

  // TODO: Should I change onChangeText event to onChange?
  // https://stackoverflow.com/questions/44416541/react-native-difference-between-onchange-vs-onchangetext-of-textinput
  // It seems like, if I ever need to use event object on change, to prevent conflict I have to care about not to change the value of text input.
  // onChange --> Trigger a side effect when change occurs
  // onChangeText --> Trigger a function that manages the input data when change occurs.
  // Or, otherwise, I can use switch/case and manage all the things in a particular structure under onChange event.
  // const onChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => setText(event.nativeEvent.text);

  const onChangeText = (content: string) => setText(content);

  /* https://stackoverflow.com/questions/34087459/focus-style-for-textinput-in-react-native */
  const onFocus = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    let focusStyle: onFocusStyleProps = {};

    /* for Android */
    if (Platform.OS === "android") {
      focusStyle = {
        borderColor: onFocusStyleProps?.borderColor ?? BorderColor.darkgrey,
      };
    } else if (Platform.OS === "ios") {
      /* for iOS */
      focusStyle = {
        // These props won't change on focus, if there's no new modifications from outside.
        shadowColor: onFocusStyleProps?.shadowColor,
        shadowOffset: onFocusStyleProps?.shadowOffset,
        // These props will change on focus.
        shadowOpacity: onFocusStyleProps?.shadowOpacity ?? 0.3,
        shadowRadius: onFocusStyleProps?.shadowRadius ?? 1,
      };
    }
    setCurrentOnFocusStyle(focusStyle);
  };

  /* https://reactnative.dev/docs/textinput#onblur */
  const onBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>) => setCurrentOnFocusStyle({});

  return (
    <SafeAreaView style={combinedContainerStyle}>
      <CustomText textStyle={combinedLabelStyle} {...textProps}>
        {label}
      </CustomText>
      <TextInput
        style={combinedTextInputStyle}
        // onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        onChangeText={onChangeText}
        value={text}
        autoCapitalize="none"
        autoComplete="off"
        maxLength={32}
        selectionColor={Platform.OS === "ios" ? TextColor.darkgrey : TextColor.grey}
        {...textInputProps}
      />
      {activateSublabel && <CustomText textStyle={combinedSublabelStyle}>{showSublabel ? sublabel : " "}</CustomText>}
      {/* NOTE: To fix text-margin problem in iOS, keep there always a empty string. */}
    </SafeAreaView>
  );
};

export default CustomTextInput;
