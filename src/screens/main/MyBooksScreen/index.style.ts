import { StyleSheet } from "react-native";

const itemContainerWidth = 150;

export default StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    alignContent: "center",
    alignItems: "center",
  },
  header: {
    fontWeight: "600",
    fontSize: 40,
  },
  itemContainer: {
    margin: 10,
    width: itemContainerWidth,
  },
  button: {},
  itemButtonInnerContainer: {},
  bookImageContainer: {
    marginBottom: 5,
  },
  bookImage: {
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
