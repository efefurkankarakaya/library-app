import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { CustomText, TransparentButton } from "../../../components";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { formatDate, logJSON, logWithTime } from "../../../utils/utils";
import { AppRealmContext } from "../../../models";
import { useEffect, useMemo, useState } from "react";
import Loan from "../../../models/Loan";
import Book from "../../../models/Book";
import { FlatList } from "react-native-gesture-handler";
import { Image } from "expo-image";
import Style from "./index.style";
import { BookDataComplete } from "../../../types/commonTypes";
import { updateBookInStore } from "../../../store/slices/bookSlice";

interface BookItemProps {
  bookData: BookDataComplete;
  onPressBook: any; // TODO: Commonize and use type here.
}

const BookItem: React.FC<BookItemProps> = ({ bookData, onPressBook }: BookItemProps) => {
  return (
    <View style={Style.itemContainer}>
      <TransparentButton
        buttonStyle={Style.button}
        touchableOpacityProps={{
          onPress: () => onPressBook(bookData),
        }}
      >
        <View style={Style.itemButtonInnerContainer}>
          <View style={Style.bookImageContainer}>
            <Image source={{ uri: bookData.bookImage }} style={Style.bookImage} />
          </View>
          <View style={Style.bookDetailsContainer}>
            <CustomText textStyle={Style.bookName}>{bookData.bookName}</CustomText>
            <CustomText textStyle={Style.bookAuthors}>{bookData.authors}</CustomText>
            <CustomText textStyle={Style.bookDateBorrowed}>{formatDate(bookData.createdAt)}</CustomText>
            {/* TODO: Find a way to show borrowing date here. */}
          </View>
        </View>
      </TransparentButton>
    </View>
  );
};

function MyBooksScreen({ navigation }) {
  const { user: activeUser } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const { useObject, useQuery } = AppRealmContext;
  const borrowings = useQuery(Loan).filtered("userId == $0", activeUser.data._id);
  const borrowedBookIds = useMemo(() => borrowings.map((borrow) => borrow.bookId), [borrowings]);
  const borrowedBooks = useQuery(Book).filtered("_id in $0", borrowedBookIds);

  useEffect(() => {
    logWithTime("[MyBooksScreen] Mounted.");
    return () => {
      logWithTime("[MyBooksScreen] Unmounted.");
    };
  }, []);

  const onPressBook = (bookData: BookDataComplete) => {
    dispatch(updateBookInStore(bookData));
    navigation.navigate("DetailsScreen");
  };

  const keyExtractor = (item) => item._id.toHexString();

  const renderItem = ({ index, item }) => {
    const { _id, bookName, bookImage, bookDescription, isbn, authors, genres, isHardcover, createdAt } = item;

    // TODO: Add button
    const bookData: BookDataComplete = {
      _id,
      bookName,
      bookImage,
      bookDescription,
      isbn,
      authors,
      genres,
      isHardcover,
    };

    return <BookItem bookData={bookData} onPressBook={onPressBook} />;
  };

  return (
    /* TODO: Use SafeAreaView for those components which has container other than ScrollView */
    <SafeAreaView style={Style.container}>
      <Text style={Style.header}>Borrowed</Text>
      <FlatList data={borrowedBooks} renderItem={renderItem} keyExtractor={keyExtractor} numColumns={2} />
    </SafeAreaView>
  );
}

export default MyBooksScreen;
