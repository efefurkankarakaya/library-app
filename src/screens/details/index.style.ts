import { Dimensions, StyleSheet } from "react-native";

/* Screen values won't be changed, can be cached. */
const screenWidth = Dimensions.get("screen").width;

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {},
  image: {
    height: "35%",
    // overflow: "visible", // TODO: Find another way to slide input container over image
    resizeMode: "stretch", // TODO: [expo-image]: Prop "resizeMode" is deprecated, use "contentFit" instead
  },
  inputContainer: {
    alignItems: "center",
  },
  description: {
    height: Dimensions.get("window").height * 0.09,
  },
  saveButtonText: {
    fontSize: screenWidth * 0.045,
    marginRight: screenWidth * 0.045,
  },
});
