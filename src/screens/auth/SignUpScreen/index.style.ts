import { StyleSheet } from "react-native";
import { isIOS } from "../../../common/common";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: isIOS ? "30%" : "15%",
  },
  headerContainer: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
    marginTop: 10,
    alignContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 25,
  },
  headerSubtext: {},
  passwordSublabel: {
    height: "auto", // To show complete text of sublabel
  },
  signUpButton: {
    marginTop: 10,
  },
});
