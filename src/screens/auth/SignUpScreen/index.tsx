import { SafeAreaView } from "react-native";

// Navigation
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../types/navigationTypes";

// Custom Components
import CustomText from "../../../components/CustomText";
import CustomTextInput from "../../../components/CustomTextInput";
import CustomButton from "../../../components/CustomButton";

import Style from "./SignUpScreen.style";
import { AppRealmContext } from "../../../models";
import { useEffect, useState } from "react";
import User from "../../../models/User";
import { createUseQuery } from "@realm/react/dist/useQuery";
import { logJSON, logWithTime } from "../../../utils/utils";

interface UserData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
}

interface SignUpScreenProps {
  navigation: NavigationProp<RootStackParamList>;
}

// https://stackoverflow.com/questions/62635831/typescript-create-interface-having-keys-of-another-interface
type UserDataStatus = {
  [key in keyof UserData]: boolean;
};

type UserDataKeys = keyof UserData;

// https://github.com/realm/realm-js/tree/main/packages/realm-react#readme
// https://blog.logrocket.com/realm-react-native/
// https://www.mongodb.com/docs/realm/sdk/node/users/create-delete-users/

// function checkIfUserExists(users, phoneNumber: string) {
//   const user = users.filtered("email == efefurkankarakaya@outlook.com");
//   console.log(user);
// }

const validateText = (text: string, regex: string) => new RegExp(regex, "g").test(text);

function validatePassword(password: string): boolean {
  /*
    - At least 1 uppercase,
    - At least 1 number,
    - At least 1 lowercase,
    - No repeatable characters or ordinary numbers more than 3,
    - At least 1 special character (_, !, ?, *, or what else?)
  */
  const passwordRegex = /g/;
  return passwordRegex.test(password);
}

function validatePhoneNumber(phoneNumber: string): boolean {
  const phoneNumberRegex = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s0-9]{9}$/;
  return phoneNumberRegex.test(phoneNumber);
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// TODO: Move outside
// TODO: Write a unit test
function createUser(realm: Realm, userData: UserData): void {
  try {
    const { firstName, lastName, phoneNumber, email, password } = userData;
    const user = User.create(firstName, lastName, phoneNumber, email, password);

    // TODO: Check if phoneNumber exists

    realm.write(() => {
      realm.create("User", user);
    });
  } catch (error) {
    console.log("[Realm | createUser]");
    console.log(error);
  }
}

// Components and basic functions are written as arrow functions
const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }: SignUpScreenProps) => {
  const { useRealm, useObject, useQuery } = AppRealmContext;
  const realm = useRealm();
  const users = useQuery(User);

  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const [isUserDataOK, setIsUserDataOK] = useState<UserDataStatus>({
    firstName: false,
    lastName: false,
    phoneNumber: false,
    email: false,
    password: false,
  });

  /* Effects */
  useEffect(() => {
    logWithTime("Sign Up Screen is mounted.");
    logWithTime(`Realm: ${realm.path}`);

    // console.log(users);
    // checkIfUserExists(useQuery, "test");
    // TODO: Check e-mail and phoneNumber, both should not be allows more than once.
    const user = users.filter((user) => logJSON("User", user));
  }, []);

  useEffect(() => {
    logJSON("Current status of inputs", userData);
  }, [userData]);

  /* Events */

  const onChangePhoneNumber = (text: string): string => {
    let phoneNumber = text;

    if (phoneNumber.length >= userData.phoneNumber.length) {
      if (phoneNumber[0] !== "(") phoneNumber = "(" + phoneNumber;
      const mask = [null, null, null, null, ") ", null, null, null, null, " "];
      phoneNumber += mask[phoneNumber.length] != null ? mask[phoneNumber.length] : "";
    }

    return phoneNumber;
    // setUserData({ ...userData, phoneNumber: text });
    // console.log(text);
    // const isValid = validateData(data, regexTypes.phone);
    // validations[2] = isValid;
    // inputs[2] = data;
  };

  const onChangeText = (text: string, textKey: UserDataKeys) => {
    const pureText: string = text;
    let processedText: string = pureText;

    switch (textKey) {
      case "firstName":
      case "lastName":
        // No special characters and also need trim
        break;
      case "phoneNumber":
        processedText = onChangePhoneNumber(pureText);
        const isPhoneNumberOK = validatePhoneNumber(processedText);
        console.log(isPhoneNumberOK);
        break;
      case "email":
        // Regex
        break;
      case "password":
        // Does it provide conditions?
        break;
      default:
        break;
    }

    const data: UserData = {
      ...userData,
      [textKey]: processedText,
    };
    setUserData(data);
  };

  // https://www.mongodb.com/docs/realm/sdk/react-native/crud/
  // https://www.mongodb.com/docs/realm/sdk/react-native/crud/read/
  const onPressSignUp = () => {
    // TODO: When user is being created, you should check if phoneNumber or e-mail is existed already and if it's
    // interrupt the registration.
    // And you should check this in database function, and also validation. If validation does not allow,
    // then form can't be completed.
    // realm.write(() => {
    //   realm.create("User", User.create("Efe", "KARAKAYA", "efefurkankarakaya@outlook.com", "1234"));
    // });

    // TODO: DO NOT ALLOW EMPTY FIELDS.

    createUser(realm, userData);

    navigation.navigate("Login");
  };

  /* ****************************************** JSX ****************************************** */
  // https://www.mongodb.com/docs/realm/sdk/react-native/manage-users/manage-email-password-users/
  // https://realm.io/?utm_source=google&utm_campaign=search_gs_pl_evergreen_realm_product_prosp-brand_gic-null_ww-multi_ps-all_desktop_eng_lead&utm_term=realm&utm_medium=cpc_paid_search&utm_ad=p&utm_ad_campaign_id=11303420057&adgroup=132586004050&cq_cmp=11303420057&gad=1&gclid=EAIaIQobChMIlr_4rb_P_wIVsItoCR0b9gmnEAAYASAAEgIKw_D_BwE
  // https://reactnative.dev/docs/textinput
  return (
    <SafeAreaView style={Style.container}>
      {/* First Name */}
      <CustomTextInput
        textInputProps={{
          placeholder: "First Name",
          onChangeText: (text: string) => onChangeText(text, "firstName"),
          value: userData.firstName,
        }}
      />

      {/* Last Name */}
      <CustomTextInput
        textInputProps={{
          placeholder: "Last Name",
          onChangeText: (text: string) => onChangeText(text, "lastName"),
          value: userData.lastName,
        }}
      />

      {/* Phone Number */}
      <CustomTextInput
        textInputProps={{
          keyboardType: "number-pad",
          placeholder: "Phone Number",
          onChangeText: (text: string) => onChangeText(text, "phoneNumber"),
          value: userData.phoneNumber,
          maxLength: 14,
        }}
      />

      {/* E-mail */}
      <CustomTextInput
        textInputProps={{
          placeholder: "E-mail Address",
          keyboardType: "email-address",
          onChangeText: (text: string) => onChangeText(text, "email"),
          value: userData.email,
        }}
      />

      <CustomTextInput
        textInputProps={{
          placeholder: "Password",
          secureTextEntry: true,
          onChangeText: (text: string) => onChangeText(text, "password"),
          value: userData.password,
        }}
      />
      {/* // TODO: Add show password button */}
      {/* TODO: Commonize password and e-mail props with login page */}
      <CustomButton touchableOpacityProps={{ onPress: onPressSignUp }}>Sign Up</CustomButton>
    </SafeAreaView>
  );
};

export default SignUpScreen;
