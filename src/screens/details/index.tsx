import { useEffect, useRef, useState } from "react";
import { Dimensions, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { CustomButton, CustomText, CustomTextInput, TextButton, ValidatorTextInput } from "../../components";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Image } from "expo-image";
import { TextColor } from "../../common/colorPalette";
import { useNavigation } from "@react-navigation/native";
import ArrowForwardIOS from "../../../assets/arrow_forward_ios.svg";
import { addPrefixToBase64, logJSON, logWithTime } from "../../utils/utils";
import { isTextEmpty } from "../../helpers/validationHelpers";
import { AppRealmContext } from "../../models";
import Book from "../../models/Book";
import { BookData } from "../../types/commonTypes";
import Style from "./index.style";
import { createBook, updateBook } from "../../helpers/databaseHelpers";
import { temporaryDataID } from "../../common/static";
import * as ImagePicker from "expo-image-picker";
import { updateImageInStore } from "../../store/slices/bookSlice";
// TODO: Refactor imports

/* 
    TODO: If user is authenticated, then user can create and edit books.
  */

type BookDataValidationStatus = {
  [key in keyof BookData]: boolean;
};

type BookDataKeys = keyof BookData;

/* ================ Component Props ================ */
interface SaveButtonProps {
  onPress: any;
}

interface DetailsScreenProps {
  navigation: any;
}
/* ================ End ================ */

/* ================ File Private Components ================ */
const SaveButton: React.FC<SaveButtonProps> = ({ onPress }: SaveButtonProps) => {
  return (
    <TextButton
      textStyle={Style.saveButtonText}
      touchableOpacityProps={{
        onPress,
      }}
    >
      Save
    </TextButton>
  );
};
/* ================ End ================ */

function DetailsScreen({ navigation }: DetailsScreenProps) {
  /* ================ Custom Hooks ================ */
  const { useRealm, useObject } = AppRealmContext;
  const { user: activeUser, book: activeBook } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const navigationHook = useNavigation();

  const realm = useRealm();
  const bookToBeUpdated = useObject(Book, activeBook.data._id);
  /* ================ End ================ */

  /* ================ States ================ */
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const [bookData, setBookData] = useState<BookData>({
    bookName: "",
    bookImage: "" /* Not in use, just for fulfilling the type for now. */,
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
    bookImage: true /* Image can't be removed, no need to validate */,
    bookDescription: true /* Optional */,
    isbn: false /* Mandatory */,
    authors: false /* Mandatory */,
    genres: false /* Mandatory */,
  });

  const [isBookDataValid, setIsBookDataValid] = useState<boolean>(false);
  const isBookDataValidRef = useRef<boolean>(false);
  isBookDataValidRef.current = isBookDataValid;
  /* ================ End ================ */

  /* ================ Effects ================ */
  useEffect(() => {
    /* TODO: Add Change Image Button in headerCenter */
    navigationHook.setOptions({
      headerRight: () => activeUser.isSU && <SaveButton onPress={onSave} />,
      headerTitle: () => activeUser.isSU && <TextButton textProps={{ onPress: onChangeImage }}>Change</TextButton>,
    });
  }, []);

  useEffect(() => {
    const { bookName, bookImage, bookDescription, isbn, authors, genres } = activeBook.data;

    setBookData({
      bookName,
      bookImage,
      bookDescription,
      isbn,
      authors,
      genres,
    });

    setBookDataValidationStatus({
      bookName: !!bookName,
      bookImage: true,
      bookDescription: true,
      isbn: !!isbn,
      authors: !!authors,
      genres: !!genres,
    });

    logWithTime("[Details] Change detected.");
  }, [activeBook]);

  useEffect(() => {
    const isValidationFailed = Object.values(bookDataValidationStatus).includes(false);
    setIsBookDataValid(!isValidationFailed);
  }); // TODO: Check this validation
  /* ================ End ================ */

  /* ================ Event Handlers ================ */
  const onChangeImage = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      selectionLimit: 1,
      quality: 1,
    });

    if (!result.canceled) {
      const updatedBase64 = addPrefixToBase64(result.assets[0].base64); // TODO: Fix
      dispatch(updateImageInStore(updatedBase64));
    }
  };

  const onSave = () => {
    logWithTime("Clicked on save.");
    setIsSubmitted(true);

    if (!isBookDataValidRef.current) {
      logWithTime("Data is not valid.");
      return;
    }

    // const { bookName = "", bookDescription = "", isbn = "", authors = "", genres = "" } = bookDataRef.current || {};
    // const arrayOfAuthors = authors?.split(",").map((author) => author.trim()) || []; // TODO: Remove
    // const arrayOfGenres = genres?.split(",").map((genre) => genre.trim()) || [];

    if (activeBook.data._id !== temporaryDataID) {
      updateBook(realm, bookDataRef.current, bookToBeUpdated);
    } else {
      createBook(realm, bookDataRef.current);
    }

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

  /* ================ Screen (Main Component) ================ */
  // TODO: Use text component for non-su
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={Style.container}
      contentContainerStyle={Style.contentContainer}
    >
      {/* <CustomText>Details Page</CustomText> */}
      {/* @ts-ignore: URI can be string, null or undefined. */}
      <Image source={{ uri: activeBook.data.bookImage }} style={Style.image} />
      <View style={Style.inputContainer}>
        <CustomTextInput
          textInputProps={{
            placeholder: "Name",
            onChangeText: (text: string) => onChangeText(text, "bookName"),
            value: bookData.bookName,
            editable: activeUser.isSU,
          }}
        />
        <CustomTextInput
          textInputProps={{
            placeholder: "Description (optional)",
            multiline: true,
            numberOfLines: 4,
            onChangeText: (text: string) => onChangeText(text, "bookDescription"),
            value: bookData.bookDescription,
            editable: activeUser.isSU,
          }}
          customTextInputStyle={Style.description}
        />
        <CustomTextInput
          textInputProps={{
            placeholder: "ISBN",
            onChangeText: (text: string) => onChangeText(text, "isbn"),
            value: bookData.isbn,
            keyboardType: "number-pad",
            editable: activeUser.isSU,
          }}
        />
        <CustomTextInput
          textInputProps={{
            placeholder: "Author(s)",
            onChangeText: (text: string) => onChangeText(text, "authors"),
            value: bookData.authors,
            editable: activeUser.isSU,
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
            editable: activeUser.isSU,
          }}
        />
        {/* Selectbox isHardcover? */}
      </View>
    </KeyboardAvoidingView>
  );
}

export default DetailsScreen;
