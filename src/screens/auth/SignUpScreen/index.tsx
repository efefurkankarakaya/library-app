import { useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";

// Navigation
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../types/navigationTypes";

// Database
import { AppRealmContext } from "../../../models";
import User from "../../../models/User";

// Custom Components
import CustomText from "../../../components/CustomText";
import CustomButton from "../../../components/CustomButton";

// Others
import Style from "./SignUpScreen.style";
import { logJSON, logWithTime, validateText } from "../../../utils/utils";

import * as Crypto from "expo-crypto"; // TODO: Do you really need the all?
import ValidatorTextInput from "../../../components/ValidatorTextInput";

/* TODO: Add onFocus & onBlur events to these components (with changeable border and shadow color) */
// https://stackoverflow.com/questions/34087459/focus-style-for-textinput-in-react-native

/* TODO: Commonize password and e-mail props with login page */

/* TODO: Add User Agreement checkbox */

/* TODO: Add confirmation page (Show 6 random digits and let user write this digit by digit */

/* TODO: After registration, show user a success page and route user to home / dashboard */

interface UserData {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

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

// https://github.com/realm/realm-js/tree/main/packages/realm-react#readme
// https://blog.logrocket.com/realm-react-native/
// https://www.mongodb.com/docs/realm/sdk/node/users/create-delete-users/

// function checkIfUserExists(users, phoneNumber: string) {
//   const user = users.filtered("email == efefurkankarakaya@outlook.com");
//   console.log(user);
// }

function validateName(name: string): boolean {
  const nameRegex = /[a-zA-ZçğıöşüÇĞİÖŞÜ ]{2,}/g;
  return validateText(name, nameRegex);
}

function validatePhoneNumber(phoneNumber: string): boolean {
  /* 
  Regex 1: /0 [+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[\s0-9]{4}[\s0-9]{3}[\s0-9]{3}$/
  Valid Inputs: 0 (555) 555 55 55

  Regex 2: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s0-9]{9}$/
  Valid Inputs: (555)-555 55 55, (555) 555 55 55, (555) 555-5555
  */
  const phoneNumberRegex = /0 [+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[\s0-9]{4}[\s0-9]{3}[\s0-9]{3}$/;
  return validateText(phoneNumber, phoneNumberRegex); // TODO: Use validateText()
}

function validateEmailAddress(email: string): boolean {
  // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  /**
   * https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression
   * https://emailregex.com/
   * General Email Regex (RFC 5322 Official Standard)
   */
  const emailRegex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;
  return validateText(email, emailRegex);
}

// https://stackoverflow.com/questions/1054022/best-way-to-store-password-in-database
function validatePassword(password: string): boolean {
  /*
   * https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
   * At least one upper case Turkish-keyboard letter, (?=.*?[A-ZÇĞİÖŞÜ])
   * At least one lower case Turkish-keyboard letter, (?=.*?[a-zçğıöşü])
   * At least one digit, (?=.*?[0-9])
   * At least one special character, (?=.*?[#.?,!+@_$%^&*-])
   * Minimum 8-characters length .{8,} (with the anchors)
   *
   NOTE: [*-_] pattern can be interpreted as: *-_ matches a single character in the range between * (index 42) and _ (index 95) (case sensitive)
   Therefore, the dash (-) symbol should be used at the end of the pattern if required to be use as a character.
   */
  const passwordRegex = /^(?=.*?[A-ZÇĞİÖŞÜ])(?=.*?[a-zçğıöşü])(?=.*?[0-9])(?=.*?[#.?,!+@_$%^&*-]).{8,}$/g;
  return validateText(password, passwordRegex);
}

function confirmPassword(password: string, confirm: string): boolean {
  return password === confirm;
}

// TODO: Move outside
// TODO: Write a unit test
async function createUser(realm: Realm, userData: UserData): Promise<void> {
  /**
   * https://stackoverflow.com/questions/1054022/best-way-to-store-password-in-database
   * https://stackoverflow.com/questions/674904/salting-your-password-best-practices
   * https://stackoverflow.com/questions/947618/how-to-best-store-user-information-and-user-login-and-password
   * https://security.stackexchange.com/questions/211/how-to-securely-hash-passwords
   */
  try {
    const { fullName, phoneNumber, email, password } = userData;

    const trimmedFullName = fullName.trim();
    const encryptedPassword = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);

    const user = User.create(trimmedFullName, phoneNumber, email, encryptedPassword);

    // TODO: Check if phoneNumber &| e-mail address exists

    realm.write(() => {
      realm.create("User", user);
      logWithTime("Succcessfully signed up: ", user.email);
    });
  } catch (error: unknown) {
    logWithTime("[Realm | createUser]");
    logWithTime(error);
  }
}

// Components and basic functions are written as arrow functions
const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }: SignUpScreenProps) => {
  const { useRealm, useObject, useQuery } = AppRealmContext; // TODO: Remove unused destructuring
  const realm = useRealm();
  const users = useQuery(User);
  // realm.write(() => {
  //   realm.delete(users);
  // });

  const [userData, setUserData] = useState<UserData>({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isUserDataOK, setIsUserDataOK] = useState<UserDataValidationStatus>({
    fullName: false,
    phoneNumber: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [isUserDataAlreadyExisted, setIsUserDataAlreadyExisted] = useState<UserDataExistenceStatus>({
    phoneNumber: false,
    email: false,
  });

  /* Effects */
  useEffect(() => {
    logWithTime("Sign Up Screen is mounted.");
    logWithTime(`Realm: ${realm.path}`);

    // const user = users.filter((user) => logJSON("User", user)); // TODO: Remove.
  }, []);

  // useEffect(() => {
  //   logJSON("Current status of inputs", userData);
  //   logJSON("User Data Validation Status", isUserDataOK);
  // }, [userData]);

  /* Events */
  const onChangeName = (text: string): string => {
    /* TODO: Trim to clean up extra whitespaces at the begin or the end of the string */
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
        // TODO: Should I consider hashing every change?
        // processedText = pureText;
        isTextOK = validatePassword(processedText);
        break;
      case "confirmPassword":
        isTextOK = confirmPassword(userData.password, processedText);
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
    // realm.write(() => {
    //   realm.create("User", User.create("Efe", "KARAKAYA", "efefurkankarakaya@outlook.com", "1234"));
    // });

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

    navigation.navigate("Login");
  };

  /* ****************************************** JSX ****************************************** */
  // https://www.mongodb.com/docs/realm/sdk/react-native/manage-users/manage-email-password-users/
  // https://realm.io/?utm_source=google&utm_campaign=search_gs_pl_evergreen_realm_product_prosp-brand_gic-null_ww-multi_ps-all_desktop_eng_lead&utm_term=realm&utm_medium=cpc_paid_search&utm_ad=p&utm_ad_campaign_id=11303420057&adgroup=132586004050&cq_cmp=11303420057&gad=1&gclid=EAIaIQobChMIlr_4rb_P_wIVsItoCR0b9gmnEAAYASAAEgIKw_D_BwE
  // https://reactnative.dev/docs/textinput

  return (
    <SafeAreaView style={Style.container}>
      <View style={Style.headerContainer}>
        <CustomText customTextStyle={Style.header}>Create an account</CustomText>
        <CustomText customTextStyle={Style.headerSubtext}>You are just one step away to the books!</CustomText>
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
      <ValidatorTextInput
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
      />
      {/* TODO: Need margin here */}
      <CustomButton customButtonStyle={Style.signUpButton} touchableOpacityProps={{ onPress: onPressSignUp }}>
        Sign Up
      </CustomButton>
    </SafeAreaView>
  );
};

export default SignUpScreen;
