import { Platform, StyleSheet } from "react-native";

const Style = (isDataOK: boolean) =>
  StyleSheet.create({
    sublabel: {
      fontSize: 10,
      color: isDataOK ? "limegreen" : "red",
      minHeight: 15,
      paddingTop: Platform.OS === "ios" ? 5 : 0 /* Keep label below shadow-offset */,
      paddingLeft: "3%",
    },
  });

export default Style;
