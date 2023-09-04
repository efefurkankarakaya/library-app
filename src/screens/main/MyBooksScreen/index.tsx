import { ScrollView, Text, View } from "react-native";
import { CustomText } from "../../../components";
import { useAppSelector } from "../../../store/hooks";
import { logJSON, logWithTime } from "../../../utils/utils";
import { AppRealmContext } from "../../../models";
import { useEffect, useMemo, useState } from "react";
import Loan from "../../../models/Loan";
import Book from "../../../models/Book";
import { FlatList } from "react-native-gesture-handler";

function MyBooksScreen({ navigation }) {
  const { user: activeUser, loan } = useAppSelector((state) => state);
  const { useObject, useQuery } = AppRealmContext;
  const borrowings = useQuery(Loan).filtered("userId == $0", activeUser.data._id);
  const borrowedBookIds = useMemo(() => borrowings.map((borrow) => borrow.bookId), [borrowings]);
  const borrowedBooks = useQuery(Book).filtered("_id in $0", borrowedBookIds);
  // logJSON(activeUser);
  // logJSON(loan);
  // logJSON(borrowings);
  // logJSON(borrowedBooks);

  useEffect(() => {
    logWithTime("[MyBooksScreen] Mounted.");
    return () => {
      logWithTime("[MyBooksScreen] Unmounted.");
    };
  }, []);

  const keyExtractor = (item) => item._id.toHexString();

  const renderItem = ({ index, item }) => {
    const { _id, bookName, bookImage, bookDescription, isbn, authors, genres, isHardcover, createdAt } = item;

    return (
      <View>
        <Text>{bookName}</Text>
        <Text>{createdAt.toString()}</Text>
        {/* TODO: Moment could be useful */}
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        marginTop: 70,
      }}
    >
      <CustomText>MyBooks</CustomText>
      <FlatList data={borrowedBooks} renderItem={renderItem} keyExtractor={keyExtractor} />
    </View>
  );
}

export default MyBooksScreen;
