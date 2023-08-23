/* Core */
import { useEffect, useMemo, useState } from "react";
import { FlatList, Text, SafeAreaView, View, Image } from "react-native";

/* Navigation */
import { NavigationProp } from "@react-navigation/native";

/* Custom Components */
import { CustomText, CustomTextInput } from "../../components";

/* Database */
import { AppRealmContext } from "../../models";
import Book from "../../models/Book";

/* Store */
import { useAppSelector } from "../../store/hooks";

/* Style */
import Style from "./index.style";

/* Types */
import { MainStackParamList } from "../../types/navigationTypes";

/* Others */
import { useSwipe } from "../../helpers/gestureHelpers";

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

  const [searchQuery, setSearchQuery] = useState<string>("");
  const filteredBooks = useMemo(() => filterBooks(books, searchQuery), [books, searchQuery]);

  const user = useAppSelector(({ user }) => user);
  console.log(user);

  useEffect(() => {
    // realm.write(() => {
    //   realm.delete(books);
    // });
    /* */
    // realm.write(() => {
    // realm.create(
    //   "Book",
    //   Book.create("Brave New World", "<base64>", "A brave whole new world!", "123", ["Aldous Huxley"], ["Distopia"], false)
    // );
    // realm.create("Book", Book.create("Fahrenheit 451", "<base64>", "fahrenheit", "124", ["Ray Bradbury"], ["Distopia"], false));
    // realm.create("Book", Book.create("Fahrenheit 451", bookImage, "fahrenheit", "124", ["Ray Bradbury"], ["Distopia"], false));
    // });
    // console.log(books);
  }, []);

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
    // Run Camera
    navigation.navigate("CamScreen");
    console.log("Swipe Right");
  };

  const onSwipeLeft = () => {
    // Run Gallery
    console.log("Swipe Left");
  };

  const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight, 6);

  /* FlatList functions */
  const keyExtractor = (item: Book & Realm.Object) => item._id.toHexString();

  const renderItem = ({ index, item }: FlatListItem) => {
    // console.log(item);
    // https://github.com/DylanVann/react-native-fast-image
    return (
      <View>
        <Text>{item.bookName}</Text>
        <Image source={{ uri: "data:image/png;base64," + item.bookImage }} />
      </View>
    );
  };

  return (
    <SafeAreaView style={Style.container} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <CustomText>Home</CustomText>
      <CustomTextInput
        textInputProps={{
          value: searchQuery,
          onChangeText: (text: string) => setSearchQuery(text),
        }}
      />
      <View>
        <FlatList data={filteredBooks} renderItem={renderItem} keyExtractor={keyExtractor} />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
