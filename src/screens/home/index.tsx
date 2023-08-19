/* Core */
import { useEffect, useMemo, useState } from "react";
import { FlatList, Text, SafeAreaView, ListRenderItem } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

/* Navigation */
import { NavigationProp } from "@react-navigation/native";

/* Custom Components */
import CustomText from "../../components/CustomText";

/* Database */
import { AppRealmContext } from "../../models";
import Book from "../../models/Book";

/* Store */
import { useAppSelector } from "../../store/hooks";

/* Types */
import { MainStackParamList } from "../../types/navigationTypes";
import CustomTextInput from "../../components/CustomTextInput";

interface HomeScreenProps {
  navigation: NavigationProp<MainStackParamList>; // TODO: Probably, this argument is going to be MainScreenParamList which is mixed of all the main screens.
}

interface FlatListItem {
  index: number;
  item: Book & Realm.Object;
}

function filterBooks(books: Realm.Results<Book & Realm.Object>, query: string) {
  const lowerCaseQuery = query.toLowerCase().trim();
  return books.filter((book) => book.bookName.toLowerCase().includes(lowerCaseQuery));
}

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
    //   realm.create(
    //     "Book",
    //     Book.create("Brave New World", "<base64>", "A brave whole new world!", "123", ["Aldous Huxley"], ["Distopia"], false)
    //   );
    //   realm.create("Book", Book.create("Fahrenheit 451", "<base64>", "fahrenheit", "124", ["Ray Bradbury"], ["Distopia"], false));
    // });
    // console.log(books);
  }, []);

  useEffect(() => {
    /* TODO: During the development, state can change and user login status turned to be false when hot reload runs but what if it happens in production? */
    if (!user.isLoggedIn) {
      /* @ts-ignore */
      navigation.navigate("Authentication", { screen: "Login" });
    }
  }, [user]);

  /* FlatList functions */
  const keyExtractor = (item: Book & Realm.Object) => item._id.toHexString();

  const renderItem = ({ index, item }: FlatListItem) => {
    console.log(item);
    return <Text>{item.bookName}</Text>;
  };

  return (
    <SafeAreaView>
      <CustomText>Home</CustomText>
      <CustomTextInput
        textInputProps={{
          value: searchQuery,
          onChangeText: (text: string) => setSearchQuery(text),
        }}
      />
      <FlatList data={filteredBooks} renderItem={renderItem} keyExtractor={keyExtractor} />
    </SafeAreaView>
  );
};

export default HomeScreen;
