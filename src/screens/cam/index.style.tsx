import { Dimensions, StyleSheet } from "react-native";
import { CameraButtonColor, TextColor } from "../../common/colorPalette";

const { width, height } = Dimensions.get("screen");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    // backgroundColor: "white",
    width,
    height,
  },
  row: {
    flexDirection: "row",
  },
  permissionContainer: {
    height: "100%",
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
    marginTop: 50,
    width: "100%",
  },
  cameraTopBarInnerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cameraBottomBarContainer: {
    position: "absolute",
    bottom: 70,
    width: "100%",
  },
  cameraBottomBarInnerContainer: {
    // backgroundColor: "white",
    // alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cameraGalleryButtonContainer: {
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
