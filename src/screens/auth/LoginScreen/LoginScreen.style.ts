import { Platform, StyleSheet } from "react-native";
import { TextColor } from "../../../common/colorPalette";

export default StyleSheet.create({
  container: {
    marginTop: Platform.OS === "ios" ? "7.5%" : "15%",
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
    padding: 0,
    border: "none",
    backgroundColor: "transparent",
    marginBottom: 10,
  },
  forgotPasswordText: {
    color: TextColor.urlBlue,
  },
  signUpContainer: {
    flexDirection: "row",
  },
  signUpButton: {
    padding: 0,
    margin: 0,
    border: "none",
    backgroundColor: "transparent",
  },
  signUpText: {
    color: TextColor.urlBlue,
    margin: 0,
    padding: 0,
  },
  footer: {
    position: "absolute",
    bottom: 20,
  },
  footerText: {
    fontSize: 12,
  },
});
