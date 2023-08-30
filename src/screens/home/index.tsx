/* Core */
import { useEffect, useMemo, useState } from "react";
import { FlatList, Text, SafeAreaView, View } from "react-native";

/* Expo */
import { Image } from "expo-image";

/* Navigation */
import { NavigationProp } from "@react-navigation/native";

/* Custom Components */
import { CustomButton, CustomText, CustomTextInput, TransparentButton } from "../../components";

/* Database */
import { AppRealmContext } from "../../models";
import Book from "../../models/Book";

/* Store */
import { useAppDispatch, useAppSelector } from "../../store/hooks";

/* Style */
import Style from "./index.style";

/* Types */
import { MainStackParamList } from "../../types/navigationTypes";

/* Others */
import { useSwipe } from "../../helpers/gestureHelpers";
import { updateBookInStore, updateImageInStore } from "../../store/slices/bookSlice";
import { logWithTime } from "../../utils/utils";

interface HomeScreenProps {
  navigation: NavigationProp<MainStackParamList>; // TODO: Probably, this argument is going to be MainScreenParamList which is mixed of all the main screens.
}

interface FlatListItem {
  index: number;
  item: Book & Realm.Object;
}

// TODO: Handle search by ISBN and author too.
function filterBooks(books: Realm.Results<Book & Realm.Object>, query: string) {
  const lowerCaseQuery = query.toLowerCase().trim();
  return books.filter((book) => book.bookName.toLowerCase().includes(lowerCaseQuery));
}

// TODO: https://stackoverflow.com/questions/52156083/scroll-through-the-view-when-keyboard-is-open-react-native-expo
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { useRealm, useObject, useQuery } = AppRealmContext; // TODO: Remove unused destructuring
  const realm = useRealm();
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

  const onPressBook = (bookData: any) => {
    // TODO: Add type
    dispatch(updateBookInStore(bookData));
    navigation.navigate("DetailsScreen");
  };

  /* FlatList functions */
  const keyExtractor = (item: Book & Realm.Object) => item._id.toHexString();

  // TODO: Move this component as file-private component
  const renderItem = ({ index, item }: FlatListItem) => {
    // https://github.com/DylanVann/react-native-fast-image
    const { _id, bookName, bookImage, bookDescription, isbn, authors, genres, isHardcover } = item;
    const data = {
      _id,
      bookName,
      bookImage,
      bookDescription,
      isbn,
      authors,
      genres,
      isHardcover,
    };

    return (
      <View
        style={
          {
            // borderRadius: 20,
          }
        }
      >
        <TransparentButton
          buttonStyle={{
            margin: 20,
          }}
          touchableOpacityProps={{
            onPress: () => onPressBook(data),
          }}
        >
          <View
            style={{
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: item.bookImage }}
              style={{
                height: 250,
                width: 150,
                backgroundColor: "blue",
              }}
            />
            <Text>{item.bookName}</Text>
          </View>
        </TransparentButton>
      </View>
    );
  };

  // TODO: Create a card component for books
  return (
    <SafeAreaView style={Style.container} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <CustomTextInput
        customTextInputStyle={{
          width: "100%",
        }}
        textInputProps={{
          value: searchQuery,
          onChangeText: (text: string) => setSearchQuery(text),
          placeholder: "Book, Author, ISBN...",
        }}
      />
      <View
        style={{
          margin: 10,
          alignItems: "center",
        }}
      >
        <FlatList style={{}} data={filteredBooks} renderItem={renderItem} keyExtractor={keyExtractor} horizontal={false} numColumns={2} />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
