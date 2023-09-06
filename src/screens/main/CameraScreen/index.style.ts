import { Dimensions, StyleSheet } from "react-native";
import { CameraButtonColor, TextColor } from "../../../common/colorPalette";
import { isIOS } from "../../../common/common";

const { width, height } = Dimensions.get("screen"); // TODO: common.ts -> screenWidth, screenHeight, windowWidth, windowHeight

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    backgroundColor: "black",
    width,
    height,
  },
  row: {
    flexDirection: "row",
  },
  image: {
    height: "100%",
  },
  permissionContainer: {
    height,
    alignItems: "center",
    justifyContent: "center",
  },
  informationText: {
    color: TextColor.whiteGrey,
  },
  grantPermissionButton: {},
  grantPermissionText: {},
  cameraButtonGeneric: {
    padding: 2,
  },
  cameraButtonRightEnd: {
    paddingRight: 4,
  },
  cameraTopBarContainer: {
    /* https://stackoverflow.com/questions/36938742/touchablehighlight-not-clickable-if-position-absolute */
    zIndex: 1 /* To be able to click on the button which is absolute positioned by its container. */,
    position: "absolute",
    marginTop: isIOS ? 50 : 30,
    width: "100%",
  },
  cameraTopBarInnerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cameraBottomBarContainer: {
    // backgroundColor: "white",
    position: "absolute",
    bottom: isIOS ? 70 : 40,
    width: "100%",
    height: isIOS ? "auto" : height * 0.17 /* Android somehow manage absolute containers in flex container different than expected. */,
  },
  cameraBottomBarInnerContainer: {
    // backgroundColor: "grey",
    // alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cameraGalleryButtonContainer: {
    // backgroundColor: "orange",
    alignSelf: "center",
    top: 50,
    left: 22.5,
  },
  cameraCaptureButton: {
    backgroundColor: CameraButtonColor.grey, // TODO: Find a better grey
    height: 65,
    width: 65,
    borderRadius: 100,
    marginBottom: 25,
  },
});
