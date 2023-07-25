import { StyleSheet } from "react-native";

const Style = (isDataOK: boolean) =>
  StyleSheet.create({
    sublabel: {
      fontSize: 10,
      color: isDataOK ? "limegreen" : "red",
      height: 15,
      paddingLeft: "3%",
    },
  });

export default Style;
