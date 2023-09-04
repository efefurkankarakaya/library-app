import { StyleSheet } from "react-native";

const itemContainerWidth = 150;

export default StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  header: {
    fontWeight: "600",
    fontSize: 32,
    marginBottom: 15,
  },
  columnWrapperStyle: {
    // backgroundColor: "green",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  itemContainer: {
    width: itemContainerWidth,
  },
  button: {},
  itemButtonInnerContainer: {},
  bookImageContainer: {
    marginBottom: 5,
  },
  bookImage: {
    borderRadius: 5,
    width: itemContainerWidth,
    height: 150,
  },
  bookDetailsContainer: {
    alignItems: "center",
  },
  bookName: { fontFamily: "Montserrat_600SemiBold" },
  bookAuthors: {},
  bookDateBorrowed: {
    opacity: 0.47,
    fontSize: 12,
  },
});
