/* Core */
import { useEffect, useMemo } from "react";
import { SafeAreaView, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

/* Expo */
import { Image } from "expo-image";

/* Store */
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { updateBookInStore } from "../../../store/slices/bookSlice";

/* Database */
import { AppRealmContext } from "../../../models";
import Loan from "../../../models/Loan";
import Book from "../../../models/Book";

/* Custom Components */
import { CustomText, TransparentButton } from "../../../components";

/* Style */
import Style from "./index.style";

/* Others */
import { formatDate, logJSON, logWithTime } from "../../../utils/utils";
import { BookDataComplete } from "../../../types/commonTypes";

/* TODO: Add missing types */

interface BookItemProps {
  bookData: BookDataComplete;
  onPressBook: any; // TODO: Commonize and use type here.
}

const BookItem: React.FC<BookItemProps> = ({ bookData, onPressBook }: BookItemProps): JSX.Element => {
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
            {/* TODO: Currently, it returns the current time. */}
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
      <Text style={Style.header}>My Books</Text>
      <FlatList
        columnWrapperStyle={Style.columnWrapperStyle}
        data={borrowedBooks}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
      />
    </SafeAreaView>
  );
}

export default MyBooksScreen;
