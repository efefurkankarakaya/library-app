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
  grantPermissionButton: {},
  grantPermissionText: {},
});
