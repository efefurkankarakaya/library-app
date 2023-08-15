import { Platform, StyleSheet } from "react-native";

const Style = (isDataOK: boolean) =>
  StyleSheet.create({
    sublabel: {
      // backgroundColor: "orange",
      fontSize: 10,
      marginBottom: Platform.OS === "ios" ? 0 : -10,
      color: isDataOK ? "limegreen" : "red",
      // minHeight: Platform.OS === "ios" ? 15 : 0,
      paddingTop: Platform.OS === "ios" ? 5 : 0 /* Keep label below shadow-offset */,
      paddingLeft: "3%",
    },
  });

export default Style;
