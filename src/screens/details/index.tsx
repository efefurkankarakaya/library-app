import { useEffect, useRef, useState } from "react";
import { Dimensions, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { CustomButton, CustomText, CustomTextInput, TextButton, ValidatorTextInput } from "../../components";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Image } from "expo-image";
import { TextColor } from "../../common/colorPalette";
import { useNavigation } from "@react-navigation/native";
import ArrowForwardIOS from "../../../assets/arrow_forward_ios.svg";
import { logJSON, logWithTime } from "../../utils/utils";
import { isTextEmpty } from "../../helpers/validationHelpers";
import { AppRealmContext } from "../../models";
import Book from "../../models/Book";

/* 
    If user is authenticated, then user can create and edit books.
    If there's no active book, then screen page should be ready to create.
    If there's active book, then screen page should be ready to edit / update.

  */

/* Screen values won't be changed, can be cached. */
const screenWidth = Dimensions.get("screen").width;

interface BookData {
  bookName: string;
  bookDescription: string;
  isbn: string;
  authors: string;
  genres: string;
  // isHardcover: boolean;
}

type BookDataValidationStatus = {
  [key in keyof BookData]: boolean;
};

type BookDataKeys = keyof BookData;

interface DetailsScreenProps {
  navigation: any;
}

function DetailsScreen({ navigation }: DetailsScreenProps) {
  const { useRealm, useObject, useQuery } = AppRealmContext;
  const realm = useRealm();

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const [bookData, setBookData] = useState<BookData>({
    bookName: "",
    bookDescription: "",
    isbn: "",
    authors: "",
    genres: "",
    // isHardcover: false,
  });
  const bookDataRef = useRef<BookData>(); // To get latest state in onSave function.
  bookDataRef.current = bookData;

  const [bookDataValidationStatus, setBookDataValidationStatus] = useState<BookDataValidationStatus>({
    bookName: false /* Mandatory */,
    bookDescription: true /* Optional */,
    isbn: false /* Mandatory */,
    authors: false /* Mandatory */,
    genres: false /* Mandatory */,
  });

  const [isBookDataValid, setIsBookDataValid] = useState<boolean>(false);
  const isBookDataValidRef = useRef<boolean>(false);
  isBookDataValidRef.current = isBookDataValid;

  const activeBook = useAppSelector((state) => state.book);
  const navigationHook = useNavigation();

  useEffect(() => {
    navigationHook.setOptions({
      headerRight: () => (
        <TextButton
          textStyle={{
            fontSize: screenWidth * 0.045,
            marginRight: screenWidth * 0.045,
          }}
          touchableOpacityProps={{
            onPress: onSave,
          }}
        >
          Save
        </TextButton>
      ),
    });
  }, []);

  // TODO: Remove
  useEffect(() => {
    logJSON("[useEffect]", bookData);
  }, [bookData]);

  useEffect(() => {
    logJSON("[useEffect]", bookDataValidationStatus); // TODO: Remove
    const isValidationFailed = Object.values(bookDataValidationStatus).includes(false);
    setIsBookDataValid(!isValidationFailed);
  });

  const onSave = () => {
    logWithTime("Clicked on save.");
    setIsSubmitted(true);

    if (!isBookDataValidRef.current) {
      logWithTime("Data is not valid.");
      return;
    }

    const { bookName = "", bookDescription = "", isbn = "", authors, genres } = bookDataRef.current || {};
    const arrayOfAuthors = authors?.split(",").map((author) => author.trim()) || [];
    const arrayOfGenres = genres?.split(",").map((genre) => genre.trim()) || [];
    console.log(arrayOfAuthors);
    console.log(arrayOfGenres);
    console.log(bookName);

    const book = Book.create(bookName, activeBook.base64, bookDescription, isbn, arrayOfAuthors, arrayOfGenres, false);

    realm.write(() => {
      realm.create("Book", book);
      logWithTime("Succcessfully created: ", book.bookName);
    });

    navigation.navigate("MainApp", { screen: "MainAppBottomNavigation" });
  };

  /* On Change Main Handler */
  const onChangeText = (text: string, textKey: BookDataKeys) => {
    const isValid = !isTextEmpty(text);

    const data: BookData = {
      ...bookData,
      [textKey]: text,
    };

    if (textKey !== "bookDescription") {
      const validationData: BookDataValidationStatus = { ...bookDataValidationStatus, [textKey]: isValid };
      setBookDataValidationStatus(validationData);
    }
    setIsSubmitted(false);
    setBookData(data);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
      }}
      contentContainerStyle={
        {
          // flex: 1,
        }
      }
    >
      {/* <CustomText>Details Page</CustomText> */}
      <Image
        source={{ uri: activeBook.base64 }}
        style={{
          height: "35%",
          // overflow: "visible", // TODO: Find another way to slide input container over image
          resizeMode: "stretch",
        }}
      />
      <View
        style={{
          alignItems: "center",
        }}
      >
        <CustomTextInput
          textInputProps={{
            placeholder: "Name",
            onChangeText: (text: string) => onChangeText(text, "bookName"),
            value: bookData.bookName,
          }}
        />
        <CustomTextInput
          textInputProps={{
            placeholder: "Description (optional)",
            multiline: true,
            numberOfLines: 4,
            onChangeText: (text: string) => onChangeText(text, "bookDescription"),
            value: bookData.bookDescription,
          }}
          customTextInputStyle={{
            height: Dimensions.get("window").height * 0.09,
          }}
        />
        <CustomTextInput
          textInputProps={{
            placeholder: "ISBN",
            onChangeText: (text: string) => onChangeText(text, "isbn"),
            value: bookData.isbn,
            keyboardType: "number-pad",
          }}
        />
        <CustomTextInput
          textInputProps={{
            placeholder: "Author(s)",
            onChangeText: (text: string) => onChangeText(text, "authors"),
            value: bookData.authors,
          }}
        />
        <ValidatorTextInput
          isDataOK={false}
          activateSublabel={true}
          showSublabel={isSubmitted}
          sublabel={isBookDataValid ? "" : "Basic book information should be provided."}
          textInputProps={{
            placeholder: "Genre(s)",
            onChangeText: (text: string) => onChangeText(text, "genres"),
            value: bookData.genres,
          }}
        />
        {/* Selectbox isHardcover? */}
      </View>
    </KeyboardAvoidingView>
  );
}

export default DetailsScreen;
