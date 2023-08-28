import React from "react";
import { ScrollView } from "react-native";
import { CustomText } from "../../components";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

interface DetailsScreenProps {
  navigation: any;
}

function DetailsScreen({ navigation }: DetailsScreenProps) {
  const activeBook = useAppSelector((state) => state.book);
  console.log(activeBook);

  /* 
    If user is authenticated, then user can create and edit books.
    If there's no active book, then screen page should be ready to create.
    If there's active book, then screen page should be ready to edit / update.

  */
  return (
    <ScrollView>
      <CustomText>Details Page</CustomText>
    </ScrollView>
  );
}

export default DetailsScreen;
