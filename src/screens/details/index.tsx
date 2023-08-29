import { useEffect } from "react";
import { Dimensions, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { CustomButton, CustomText, CustomTextInput, TextButton } from "../../components";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Image } from "expo-image";
import { TextColor } from "../../common/colorPalette";
import { useNavigation } from "@react-navigation/native";
import ArrowForwardIOS from "../../../assets/arrow_forward_ios.svg";
import { logWithTime } from "../../utils/utils";

/* Screen values won't be changed, can be cached. */
const screenWidth = Dimensions.get("screen").width;

interface DetailsScreenProps {
  navigation: any;
}

function DetailsScreen({ navigation }: DetailsScreenProps) {
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
            onPress: () => logWithTime("Clicked on save."),
          }}
        >
          Save
        </TextButton>
      ),
    });
  }, []);

  /* 
    If user is authenticated, then user can create and edit books.
    If there's no active book, then screen page should be ready to create.
    If there's active book, then screen page should be ready to edit / update.

  */
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
          overflow: "visible",
        }}
      />
      <View
        style={{
          alignItems: "center",
        }}
      >
        <CustomTextInput
          label="Name"
          customLabelStyle={{
            color: TextColor.iOSGrey,
          }}
        />
        <CustomTextInput
          label="Description"
          textInputProps={{
            multiline: true,
            numberOfLines: 4,
          }}
          customTextInputStyle={{
            height: Dimensions.get("window").height * 0.09,
          }}
        />
        <CustomTextInput label="ISBN" />
        <CustomTextInput label="Author(s)" />
        <CustomTextInput label="Genre" />
        {/* Selectbox isHardcover? */}
      </View>
    </KeyboardAvoidingView>
  );
}

export default DetailsScreen;
