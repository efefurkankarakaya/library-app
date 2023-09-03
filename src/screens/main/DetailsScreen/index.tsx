/* Core */
import { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, TouchableOpacityProps, View } from "react-native";

/* Expo */
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";

/* Navigation */
import { useNavigation } from "@react-navigation/native";

/* Database */
import { AppRealmContext } from "../../../models";
import Book from "../../../models/Book";
import { createBook, updateBook } from "../../../helpers/databaseHelpers";

/* Custom Components */
import { CustomTextInput, TextButton, ValidatorTextInput } from "../../../components";

/* Store */
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { updateImageInStore } from "../../../store/slices/bookSlice";

/* Style */
import Style from "./index.style";

/* Types */
import { BookData } from "../../../types/commonTypes";

/* Others */
import { addPrefixToBase64, logWithTime } from "../../../utils/utils";
import { isTextEmpty } from "../../../helpers/validationHelpers";
import { temporaryDataID } from "../../../common/static";

type BookDataValidationStatus = {
  [key in keyof BookData]: boolean;
};

type BookDataKeys = keyof BookData;

/* ================ Component Props ================ */
interface SaveButtonProps {
  onPress: TouchableOpacityProps["onPress"];
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

/* ================ Main Component ================ */
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
    bookImage: "" /* Adding an image is mandatory (in the camera section, otherwise you can't get to the details), 
    but changing the image is optional. */,
    bookDescription: "",
    isbn: "",
    authors: "",
    genres: "",
    isHardcover: false /* Not in use, for now */,
  });
  const bookDataRef = useRef<BookData>(); // To get latest state in onSave function.
  bookDataRef.current = bookData;

  const [bookDataValidationStatus, setBookDataValidationStatus] = useState<BookDataValidationStatus>({
    bookName: false,
    bookImage: true /* Image can't be removed, can be changed only. That's why no need to validate */,
    bookDescription: true /* Optional */,
    isbn: false,
    authors: false,
    genres: false,
    isHardcover: true /* Not in use, for now */,
  });

  const [isBookDataValid, setIsBookDataValid] = useState<boolean>(false);
  const isBookDataValidRef = useRef<boolean>(false);
  isBookDataValidRef.current = isBookDataValid;
  /* ================ End ================ */

  /* ================ Effects ================ */
  useEffect(() => {
    navigationHook.setOptions({
      headerRight: () => activeUser.isSU && <SaveButton onPress={onSave} />,
      headerTitle: () => activeUser.isSU && <TextButton textProps={{ onPress: onChangeImage }}>Change</TextButton>,
    });
  }, []);

  useEffect(() => {
    const { bookName, bookImage, bookDescription, isbn, authors, genres, isHardcover } = activeBook.data;

    setBookData({
      bookName,
      bookImage,
      bookDescription,
      isbn,
      authors,
      genres,
      isHardcover,
    });

    setBookDataValidationStatus({
      bookName: !!bookName,
      bookImage: true,
      bookDescription: true,
      isbn: !!isbn,
      authors: !!authors,
      genres: !!genres,
      isHardcover: true,
    });

    logWithTime("[Details] Change detected.");
  }, [activeBook]);

  useEffect(() => {
    const isValidationFailed = Object.values(bookDataValidationStatus).includes(false);
    setIsBookDataValid(!isValidationFailed);
  }); // TODO: Check this validation, there's no dependency yet.
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
      const updatedBase64 = addPrefixToBase64(result.assets[0].base64);
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
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={Style.container}
      contentContainerStyle={Style.contentContainer}
    >
      {/* <CustomText>Details Page</CustomText> */}
      {/* TODO: Handle the case image is not available. Use red screen base64 or default image. */}
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
