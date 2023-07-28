import { StyleSheet } from "react-native";
import { onFocusStyleProps } from "../../types/commonTypes";
import { BackgroundColor, BorderColor, ShadowColor, TextColor } from "../../types/colorPalette";

// https://stackoverflow.com/questions/49782275/react-native-why-does-stylesheet-create-return-object-with-numbers-and-not-styl
const Style = (currentOnFocusStyle?: onFocusStyleProps) => {
  return StyleSheet.create({
    container: {
      width: "60%",
    },
    label: {
      color: TextColor.black,
    },
    textInput: {
      backgroundColor: BackgroundColor.white,
      paddingLeft: 12,
      height: 40,
      borderRadius: 7,
      borderColor: currentOnFocusStyle?.borderColor ?? BorderColor.grey,
      borderWidth: 1,
      /* iOS only */
      /* 
      WARN  (ADVICE) View #17103 of type RCTSinglelineTextInputView has a shadow set but cannot calculate shadow efficiently.
      Consider setting a background color to fix this, or apply the shadow to a more specific component.
      */
      /* Nullish Coalescent (??) operator is more appropriate here than logical OR (||) to keep '0' as value. */
      shadowColor: currentOnFocusStyle?.shadowColor ?? ShadowColor.black,
      shadowOffset: currentOnFocusStyle?.shadowOffset ?? { width: 0, height: 4 },
      shadowOpacity: currentOnFocusStyle?.shadowOpacity ?? 0.1,
      shadowRadius: currentOnFocusStyle?.shadowRadius ?? 3,
    },
    sublabel: {},
  });
};
export default Style;
