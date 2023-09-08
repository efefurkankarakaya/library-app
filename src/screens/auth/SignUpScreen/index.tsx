/* Core */
import { useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";

/* Navigation */
import type { NavigationProp } from "@react-navigation/native";

/* Database */
import { AppRealmContext } from "../../../models";
import User from "../../../models/User";
import { createUser } from "../../../helpers/databaseHelpers";

/* Custom Components */
import { CustomText, CustomButton, ValidatorTextInput } from "../../../components";

/* Style */
import Style from "./index.style";

/* Types */
import { RootStackParamList } from "../../../types/navigationTypes";
import { UserData } from "../../../types/commonTypes";

/* Others */
import { logWithTime } from "../../../utils/utils";
import {
  // confirmPassword,
  validateEmailAddress,
  validateName,
  validatePassword,
  validatePhoneNumber,
} from "../../../helpers/validationHelpers";

/* TODO: Add confirmation page (Show 6 random digits and let user write this digit by digit */
/* TODO: After registration, show user a success page and route user to home / dashboard */

interface SignUpScreenProps {
  navigation: NavigationProp<RootStackParamList>;
}

// https://stackoverflow.com/questions/62635831/typescript-create-interface-having-keys-of-another-interface
type UserDataValidationStatus = {
  [key in keyof UserData]: boolean;
};

type UserDataExistenceStatus = {
  phoneNumber: boolean;
  email: boolean;
};

type UserDataKeys = keyof UserData;

// Components and basic functions are written as arrow functions
const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }: SignUpScreenProps): JSX.Element => {
  const { useRealm, useQuery } = AppRealmContext;
  const realm = useRealm();
  const users = useQuery(User);

  const [userData, setUserData] = useState<UserData>({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    // confirmPassword: "",
  });

  const [isUserDataOK, setIsUserDataOK] = useState<UserDataValidationStatus>({
    fullName: false,
    phoneNumber: false,
    email: false,
    password: false,
    // confirmPassword: false,
  });

  const [isUserDataAlreadyExisted, setIsUserDataAlreadyExisted] = useState<UserDataExistenceStatus>({
    phoneNumber: false,
    email: false,
  });

  /* Effects */
  useEffect(() => {
    logWithTime("Sign Up Screen is mounted.");
    logWithTime(`Realm: ${realm.path}`);
  }, []);

  // useEffect(() => {
  //   logJSON("Current status of inputs", userData);
  //   logJSON("User Data Validation Status", isUserDataOK);
  // }, [userData]);

  /* Events */
  const onChangeName = (text: string): string => {
    /*
     * Allow regular alphabet, Turkish characters and Whitespace.
     * Unbreakable space is not allowed.
     * /i: insensitive identifier does not support 'İ'.
     */
    // const name = text.replace(/([^a-zçğıöşüİ ])/gi, "").replaceAll(/[ ]{2,}/g, " ");
    const name = text.replace(/[^a-zA-ZçğıöşüÇĞİÖŞÜ ]/g, "").replaceAll(/[ ]{2,}/g, " ");
    return name;
  };

  const onChangePhoneNumber = (text: string): string => {
    const phoneNumber = text
      .replace(/\D/g, "") /* Replace non-numeric characters */
      .replace(/(^[^0])/, "") /* Replace all except 0 */
      .replace(/(^[0])(\d)/, "$1 $2") /* Allow 2 groups and set a whitespace between 0 and 555 */
      .replace(/(\d{3})(\d)/, "($1) $2") /* Allow 2 groups and cover the first group with parantheses: 0 (555) */
      /* The rest covers the parantheses and previous whitespaces */
      .replace(/([(]\d{3}[)]\s\d{3})(\d{1,2})/, "$1 $2") /* 0 (555) 555 */
      .replace(/([(]\d{3}[)]\s\d{3}\s\d{2})(\d{1,2})/, "$1 $2") /* 0 (555) 555 55 */
      .replace(/([(]\d{3}[)]\s\d{3}\s\d{2}\s\d{2})\d+?$/, "$1"); /* 0 (555) 555 55 55 */

    return phoneNumber;
  };

  const onChangeEmailAddress = (text: string): string => {
    const emailAddress = text.replace(/[^a-zA-Z0-9+._@-]/g, "");
    return emailAddress;
  };

  /* On Change Main Handler */
  const onChangeText = (text: string, textKey: UserDataKeys) => {
    const pureText: string = text;

    let processedText: string = pureText;
    let isTextOK: boolean = false;

    switch (textKey) {
      case "fullName":
        processedText = onChangeName(pureText);
        isTextOK = validateName(processedText);
        break;
      case "phoneNumber":
        processedText = onChangePhoneNumber(pureText);
        isTextOK = validatePhoneNumber(processedText);
        break;
      case "email":
        processedText = onChangeEmailAddress(pureText);
        isTextOK = validateEmailAddress(processedText);
        break;
      case "password":
        // processedText = pureText;
        isTextOK = validatePassword(processedText);
        break;
      // case "confirmPassword":
      //   isTextOK = confirmPassword(userData.password, processedText);
      default:
        break;
    }

    const data: UserData = {
      ...userData,
      [textKey]: processedText,
    };
    setUserData(data);

    const validationStatus: UserDataValidationStatus = {
      ...isUserDataOK,
      [textKey]: isTextOK,
    };
    setIsUserDataOK(validationStatus);
  };

  // https://www.mongodb.com/docs/realm/sdk/react-native/crud/
  // https://www.mongodb.com/docs/realm/sdk/react-native/crud/read/
  const onPressSignUp = () => {
    let isAnyErrorExisted = false;

    const isEmailAlreadyInUse = users.some((user) => user.email === userData.email);
    const isPhoneAlreadyInUse = users.some((user) => user.phoneNumber === userData.phoneNumber);

    const isValidationFailed = Object.values(isUserDataOK).some((userDataStatus) => !userDataStatus);

    if (isValidationFailed) {
      logWithTime("Validation failed.");
      isAnyErrorExisted = true;
    }

    if (isEmailAlreadyInUse) {
      logWithTime("E-mail address is already in use.");
      isAnyErrorExisted = true;
    }

    if (isPhoneAlreadyInUse) {
      logWithTime("Phone number is already in use.");
      isAnyErrorExisted = true;
    }

    if (isAnyErrorExisted) {
      setIsUserDataAlreadyExisted({
        ...isUserDataAlreadyExisted,
        email: isEmailAlreadyInUse,
        phoneNumber: isPhoneAlreadyInUse,
      });
      return;
    }

    createUser(realm, userData);

    navigation.navigate("LoginScreen");
  };

  /* ****************************************** JSX ****************************************** */
  return (
    <SafeAreaView style={Style.container}>
      <View style={Style.headerContainer}>
        <CustomText textStyle={Style.header}>Create an account</CustomText>
        <CustomText textStyle={Style.headerSubtext}>You are just one step away to the books!</CustomText>
      </View>

      {/* Full Name */}
      <ValidatorTextInput
        isDataOK={isUserDataOK.fullName}
        activateSublabel={true}
        showSublabel={userData.fullName.length > 0}
        sublabel={isUserDataOK.fullName ? "Cool name." : "Should be at least 2 characters."}
        textInputProps={{
          placeholder: "Full Name",
          onChangeText: (text: string) => onChangeText(text, "fullName"),
          value: userData.fullName,
          inputMode: "text",
        }}
      />
      {/* Phone Number */}
      <ValidatorTextInput
        isDataOK={isUserDataOK.phoneNumber && !isUserDataAlreadyExisted.phoneNumber}
        activateSublabel={true}
        showSublabel={userData.phoneNumber.length > 0}
        sublabel={
          isUserDataOK.phoneNumber
            ? isUserDataAlreadyExisted.phoneNumber
              ? "Phone number is already in use."
              : "Phone number is valid."
            : "Invalid phone number."
        }
        textInputProps={{
          keyboardType: "number-pad",
          placeholder: "Phone Number",
          onChangeText: (text: string) => onChangeText(text, "phoneNumber"),
          value: userData.phoneNumber,
          maxLength: 17,
        }}
        /* Testing Purposes */
        // onFocusStyleProps={{
        //   borderColor: "yellow",
        //   shadowOpacity: 0.5,
        //   shadowOffset: { width: 4, height: 16 },
        //   shadowColor: "orange",
        // }}
      />
      {/* E-mail Address */}
      <ValidatorTextInput
        isDataOK={isUserDataOK.email && !isUserDataAlreadyExisted.email}
        activateSublabel={true}
        showSublabel={userData.email.length > 0}
        sublabel={
          isUserDataOK.email
            ? isUserDataAlreadyExisted.email
              ? "E-mail address is already in use."
              : "E-mail address is valid."
            : "Invalid e-mail address."
        }
        textInputProps={{
          placeholder: "E-mail Address",
          keyboardType: "email-address",
          onChangeText: (text: string) => onChangeText(text, "email"),
          value: userData.email,
          inputMode: "email",
        }}
      />
      {/* (iOS only) https://github.com/facebook/react-native/issues/21911 */}
      <ValidatorTextInput
        isDataOK={isUserDataOK.password}
        activateSublabel={true}
        showSublabel={userData.password.length > 0}
        sublabel={
          isUserDataOK.password
            ? "Good password."
            : "Password should contain at least one uppercase, one lowercase, one special character and 8 characters."
        }
        customSublabelStyle={Style.passwordSublabel}
        textInputProps={{
          placeholder: "Password",
          secureTextEntry: true,
          onChangeText: (text: string) => onChangeText(text, "password"),
          value: userData.password,
        }}
      />
      {/* <ValidatorTextInput
        isDataOK={isUserDataOK.confirmPassword}
        activateSublabel={true}
        showSublabel={userData.confirmPassword.length > 0}
        sublabel={isUserDataOK.confirmPassword ? "Passwords are matched!" : "Passwords do not match."} //
        textInputProps={{
          placeholder: "Confirm Password",
          secureTextEntry: true,
          onChangeText: (text: string) => onChangeText(text, "confirmPassword"),
          value: userData.confirmPassword,
        }}
      /> */}
      {/* TODO: Need margin here */}
      <CustomButton buttonStyle={Style.signUpButton} touchableOpacityProps={{ onPress: onPressSignUp }}>
        Sign Up
      </CustomButton>
    </SafeAreaView>
  );
};

export default SignUpScreen;
