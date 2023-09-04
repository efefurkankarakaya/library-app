import { StyleSheet } from "react-native";
import { MainAppDefaultContainerStyle } from "../../../common/style";

export default StyleSheet.create({
  container: {
    ...MainAppDefaultContainerStyle,
  },
  header: {
    fontWeight: "600",
    fontSize: 32,
    marginBottom: 20,
  },
});
