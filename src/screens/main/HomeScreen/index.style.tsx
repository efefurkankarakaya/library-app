import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("screen");

export default StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
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
    // backgroundColor: "green",
    justifyContent: "center",
    marginRight: 10,
  },
  itemImage: {
    borderRadius: 5,
    height: 150,
    width: 100,
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
