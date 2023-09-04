import { StyleSheet } from "react-native";
import { isIOS } from "../../../common/common";

export default StyleSheet.create({
  container: {
    marginTop: isIOS ? "30%" : "15%",
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 100,
  },
  image: {
    height: 200,
    width: 200,
  },
  email: {
    marginBottom: 10,
  },
  password: {
    marginBottom: 20,
  },
  loginButton: {
    marginBottom: 10,
  },
  forgotPasswordButton: {
    marginBottom: 10,
  },
  forgotPasswordText: {},
  signUpContainer: {
    flexDirection: "row",
  },
  signUpButton: {},
  signUpText: {},
  footer: {
    position: "absolute",
    bottom: 20,
  },
  footerText: {
    fontSize: 12,
  },
});
