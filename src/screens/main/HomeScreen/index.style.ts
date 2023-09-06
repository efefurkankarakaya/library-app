import { Dimensions, StyleSheet } from "react-native";
import { MainAppDefaultContainerStyle } from "../../../common/style";

const { width } = Dimensions.get("screen");

export default StyleSheet.create({
  container: {
    ...MainAppDefaultContainerStyle,
  },
  header: {
    fontSize: 32,
    fontWeight: "600",
  },
  searchBar: {
    width: "100%",
    marginBottom: 20,
  },
  flatlistContentContainer: {
    height: "100%",
  },
  itemContainer: {
    marginBottom: 10,
  },
  itemButton: {
    // backgroundColor: "grey",
  },
  itemButtonInnerContainer: {
    flexDirection: "row",
  },
  itemImageContainer: {
    justifyContent: "center",
    marginRight: 10,
  },
  itemImage: {
    borderRadius: 5,
    height: 150,
    width: 100,
    resizeMode: "contain",
    // backgroundColor: "blue",
  },
  itemDetailsContainer: {
    // backgroundColor: "yellow",
    width,
    justifyContent: "center",
  },
  itemTitle: {
    fontWeight: "bold" /* TODO: Add bold font */,
    fontFamily: "Montserrat_600SemiBold",
  },
  itemSubtitle: {
    fontSize: 13,
  },
  itemGenre: {
    fontSize: 11,
  },
});
