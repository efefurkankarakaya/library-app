import { StyleSheet } from "react-native";
import { isIOS } from "../../common/common";

const Style = (isDataOK: boolean) =>
  StyleSheet.create({
    sublabel: {
      // backgroundColor: "orange",
      fontSize: 10,
      marginBottom: isIOS ? 0 : -10,
      color: isDataOK ? "limegreen" : "red",
      // minHeight: isIOS ? 15 : 0,
      paddingTop: isIOS ? 5 : 0 /* Keep label below shadow-offset */,
      paddingLeft: "3%",
    },
  });

export default Style;
