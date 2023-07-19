import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    width: "60%",
  },
  label: {
    color: "#0A1551",
  },
  textInput: {
    paddingLeft: 12,
    borderRadius: 3,
    borderColor: "#e2e2e2",
    borderWidth: 1,
    /* 
    WARN  (ADVICE) View #17103 of type RCTSinglelineTextInputView has a shadow set but cannot calculate shadow efficiently.
    Consider setting a background color to fix this, or apply the shadow to a more specific component.
    */
    // shadowColor: "#171717",
    // shadowOffset: { width: -2, height: 4 },
    // shadowOpacity: 0.2,
    // shadowRadius: 3,
  },
  sublabel: {
    color: "#0A1551",
  },
});
