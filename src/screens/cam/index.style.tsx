import { Platform, StyleSheet } from "react-native";
import { TextColor } from "../../common/colorPalette";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  row: {
    flexDirection: "row",
  },
  camera: {
    // backgroundColor: "#000",
  },
  permissionContainer: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  informationText: {
    color: "#D6D5CB",
  },
  grantPermissionButton: {
    // TODO: This can be common component: TextButton
    padding: 0,
    margin: 0,
    border: "none",
    backgroundColor: "transparent",
  },
  grantPermissionText: {
    color: TextColor.urlBlue,
    margin: 0,
    padding: 0,
  },
});
