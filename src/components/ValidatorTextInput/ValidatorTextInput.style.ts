import { Platform, StyleSheet } from "react-native";

const Style = (isDataOK: boolean) =>
  StyleSheet.create({
    sublabel: {
      fontSize: 10,
      color: isDataOK ? "limegreen" : "red",
      // height: 25,
      minHeight: 25,
      paddingTop: Platform.OS === "ios" ? "1.5%" : 0,
      paddingLeft: "3%",
    },
  });

export default Style;
