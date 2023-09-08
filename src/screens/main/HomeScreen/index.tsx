/* Core */
import { useEffect, useMemo, useState } from "react";
import { FlatList, SafeAreaView, Text, View } from "react-native";

/* Expo */
import { Image } from "expo-image";

/* Navigation */
import { NavigationProp } from "@react-navigation/native";

/* Custom Components */
import { CustomText, CustomTextInput, TransparentButton } from "../../../components";

/* Database */
import { AppRealmContext } from "../../../models";
import Book from "../../../models/Book";
import Loan from "../../../models/Loan";
import { updateLoansInStore } from "../../../store/slices/loanSlice";

/* Store */
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { resetBook, updateBookInStore } from "../../../store/slices/bookSlice";

/* Style */
import Style from "./index.style";

/* Types */
import { MainStackParamList } from "../../../types/navigationTypes";

/* Others */
import { useSwipe } from "../../../helpers/gestureHelpers";
import { logJSON, logWithTime } from "../../../utils/utils";
import { BookDataComplete } from "../../../types/commonTypes";

/* ================ File Private Functions ================ */
function filterBooks(books: Realm.Results<Book & Realm.Object>, query: string) {
  const lowerCaseQuery = query.toLowerCase().trim();
  return books.filter((book) => {
    return (
      book.bookName.toLowerCase().includes(lowerCaseQuery) ||
      book.authors.toLowerCase().includes(lowerCaseQuery) ||
      book.isbn.toLowerCase().includes(lowerCaseQuery) ||
      book.genres.toLowerCase().includes(lowerCaseQuery)
    );
  });
}
/* ================ End ================ */

/* ================ Types & Definitions ================ */
type TOnPressBook = (bookData: BookDataComplete) => void;

interface FlatListItem {
  index: number;
  item: Book & Realm.Object;
}
/* ================ End ================ */

/* ================ Component Props ================ */
interface HomeScreenProps {
  navigation: NavigationProp<MainStackParamList>;
}

interface BookItemProps {
  onPressBook: TOnPressBook;
  bookData: BookDataComplete;
}
/* ================ End ================ */

/* ================ File Private Components ================ */
const BookItem: React.FC<BookItemProps> = ({ onPressBook, bookData }): JSX.Element => {
  return (
    <View style={Style.itemContainer}>
      <TransparentButton
        buttonStyle={Style.itemButton}
        touchableOpacityProps={{
          onPress: () => onPressBook(bookData),
        }}
      >
        <View style={Style.itemButtonInnerContainer}>
          <View style={Style.itemImageContainer}>
            {/* TODO: Handle the case image is not available. Use red screen base64 or default image. */}
            <Image source={{ uri: bookData.bookImage }} style={Style.itemImage} />
          </View>
          <View style={Style.itemDetailsContainer}>
            <CustomText textStyle={Style.itemTitle}>{bookData.bookName}</CustomText>
            <CustomText textStyle={Style.itemSubtitle}>{bookData.authors}</CustomText>
            <CustomText textStyle={Style.itemGenre}>{bookData.genres}</CustomText>
          </View>
        </View>
      </TransparentButton>
    </View>
  );
};
/* ================ End ================ */

// TODO: https://stackoverflow.com/questions/52156083/scroll-through-the-view-when-keyboard-is-open-react-native-expo
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const activeUser = useAppSelector(({ user }) => user);

  const { useRealm, useQuery } = AppRealmContext; // TODO: Remove unused destructuring
  // const realm = useRealm();
  const loans = useQuery(Loan);
  /* TODO: What if there's no data? */
  const loanedBookIds = useMemo(() => loans.map((loan) => loan.bookId), [loans]);
  const books = useQuery(Book)
    .filtered("NOT _id IN $0", loanedBookIds) /* Books that are not loaned / borrowed. */
    .sorted("createdAt", true); /* Newest top */

  const [searchQuery, setSearchQuery] = useState<string>("");
  const filteredBooks = useMemo(() => filterBooks(books, searchQuery), [books, searchQuery]);

  logJSON(activeUser);

  /* TODO: Need to find a touch action to delete books. */
  // useEffect(() => {
  //   realm.write(() => {
  //     realm.delete(books);
  //   });
  // }, []);

  useEffect(() => {
    /* Remove active book if exists from previous user. */
    dispatch(resetBook());
  }, []);

  // useEffect(() => {
  //   dispatch(updateLoansInStore(loans));
  // }, [loans]);

  useEffect(() => {
    /* TODO: During the development, state can change and user login status turned to be false when hot reload runs but what if it happens in production? */
    if (!activeUser.isLoggedIn) {
      /* @ts-ignore */
      navigation.navigate("Authentication", { screen: "Login" });
    }
  }, [activeUser]);

  useEffect(() => {
    console.log("[Home] Change detected.");
  }, [books]);

  const onSwipeRight = () => {
    if (activeUser.isSU) {
      // Run Camera
      navigation.navigate("CamScreen");
      logWithTime("[Swipe Right]");
    }
  };

  const onSwipeLeft = () => {
    // TODO: Maybe navigation between pages (bottom-navigation) with swipes?
    logWithTime("[Swipe Left]");
  };

  const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight, 6);

  const onPressBook = (bookData: BookDataComplete) => {
    dispatch(updateBookInStore(bookData));
    navigation.navigate("DetailsScreen");
  };

  /* FlatList functions */
  const keyExtractor = (item: Book & Realm.Object) => item._id.toHexString();

  const renderItem = ({ index, item }: FlatListItem) => {
    // https://github.com/DylanVann/react-native-fast-image
    const { _id, bookName, bookImage, bookDescription, isbn, authors, genres, isHardcover } = item;
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

    return <BookItem onPressBook={onPressBook} bookData={bookData} />;
  };

  // TODO: Create a card component for books
  return (
    <SafeAreaView style={Style.container} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {/* TODO: Add search icon to search bar
      TODO: Maybe smaller text input?
      */}
      {/* To use default font */}
      <Text style={Style.header}>Library</Text>
      <CustomTextInput
        customContainerStyle={Style.searchBar}
        textInputProps={{
          value: searchQuery,
          onChangeText: (text: string) => setSearchQuery(text),
          placeholder: "Search for book, author, ISBN or genre",
        }}
      />
      <View style={{}}>
        <FlatList
          contentContainerStyle={Style.flatlistContentContainer}
          data={filteredBooks}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal={false}
          numColumns={1}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
