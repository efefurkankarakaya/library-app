/* Core */
import { useEffect, useMemo, useState } from "react";
import { FlatList, SafeAreaView, View } from "react-native";

/* Expo */
import { Image } from "expo-image";

/* Navigation */
import { NavigationProp } from "@react-navigation/native";

/* Custom Components */
import { CustomText, CustomTextInput, TransparentButton } from "../../../components";

/* Database */
import { AppRealmContext } from "../../../models";
import Book from "../../../models/Book";

/* Store */
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

/* Style */
import Style from "./index.style";

/* Types */
import { MainStackParamList } from "../../../types/navigationTypes";

/* Others */
import { useSwipe } from "../../../helpers/gestureHelpers";
import { updateBookInStore } from "../../../store/slices/bookSlice";
import { logWithTime } from "../../../utils/utils";
import { BookDataComplete } from "../../../types/commonTypes";

type TOnPressBook = (bookData: BookDataComplete) => void;

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

interface FlatListItem {
  index: number;
  item: Book & Realm.Object;
}

/* ================ Component Props ================ */
interface HomeScreenProps {
  navigation: NavigationProp<MainStackParamList>; // TODO: Probably, this argument is going to be MainScreenParamList which is mixed of all the main screens.
}

interface BookItemProps {
  onPressBook: TOnPressBook;
  bookData: BookDataComplete;
}
/* ================ End ================ */

/* ================ File Private Components ================ */
const BookItem: React.FC<BookItemProps> = ({ onPressBook, bookData }) => {
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
            <CustomText textStyle={Style.itemSubtitle}>{bookData.genres}</CustomText>
          </View>
        </View>
      </TransparentButton>
    </View>
  );
};
/* ================ End ================ */

// TODO: https://stackoverflow.com/questions/52156083/scroll-through-the-view-when-keyboard-is-open-react-native-expo
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { useRealm, useQuery } = AppRealmContext; // TODO: Remove unused destructuring
  // const realm = useRealm();
  const books = useQuery(Book);

  const dispatch = useAppDispatch();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const filteredBooks = useMemo(() => filterBooks(books, searchQuery), [books, searchQuery]);

  const user = useAppSelector(({ user }) => user);
  console.log(user);

  // useEffect(() => {
  //   realm.write(() => {
  //     realm.delete(books);
  //   });
  // }, []);

  // https://stackoverflow.com/questions/45854450/detect-swipe-left-in-react-native
  // https://docs.expo.dev/versions/latest/sdk/gesture-handler/
  // https://docs.swmansion.com/react-native-gesture-handler/docs/
  // If user SU and swipe left is triggered, then start camera and save product,
  // Product Edit / Details page (same page, but if user is su, it becomes editable)

  useEffect(() => {
    /* TODO: During the development, state can change and user login status turned to be false when hot reload runs but what if it happens in production? */
    if (!user.isLoggedIn) {
      /* @ts-ignore */
      navigation.navigate("Authentication", { screen: "Login" });
    }
  }, [user]);

  useEffect(() => {
    console.log("[Home] Change detected.");
  }, [books]);

  const onSwipeRight = () => {
    if (user.isSU) {
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
      <CustomTextInput
        customContainerStyle={{
          width: "100%",
          marginBottom: 20,
        }}
        textInputProps={{
          value: searchQuery,
          onChangeText: (text: string) => setSearchQuery(text),
          placeholder: "Search for book, author, ISBN or genre",
        }}
      />
      <View style={{}}>
        <FlatList data={filteredBooks} renderItem={renderItem} keyExtractor={keyExtractor} horizontal={false} numColumns={1} />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
