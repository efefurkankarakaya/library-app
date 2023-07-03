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
import { logJSON } from "../../../utils/utils";

interface UserData {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
}

interface SignUpScreenProps {
  navigation: NavigationProp<RootStackParamList>;
}

type UserDataKeys = keyof UserData;

// https://github.com/realm/realm-js/tree/main/packages/realm-react#readme
// https://blog.logrocket.com/realm-react-native/
// https://www.mongodb.com/docs/realm/sdk/node/users/create-delete-users/

// function checkIfUserExists(users, userName: string) {
//   const user = users.filtered("email == efefurkankarakaya@outlook.com");
//   console.log(user);
// }

// TODO: Move outside
function createUser(realm: Realm, userData: UserData) {
  try {
    const { firstName, lastName, userName, email, password } = userData;
    const user = User.create(firstName, lastName, userName, email, password);

    // TODO: Check if userName exists

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
  // TODO: Suggest username according to firstName + lastName but should be checked the name is not available in DB.
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
  });

  const { useRealm, useObject, useQuery } = AppRealmContext;
  const realm = useRealm();
  const users = useQuery(User);

  /* Effects */
  useEffect(() => {
    console.log("Sign Up Screen is mounted.");
    console.log(`Realm: ${realm.path}`);

    // console.log(users);
    // checkIfUserExists(useQuery, "test");
    // TODO: Check e-mail and username, both should not be allows more than once.
    const user = users.filter((user) => logJSON("User", user));
  }, []);

  useEffect(() => {
    // console.log(JSON.stringify(userData, null, "\t")); // TODO: Commonize this
    logJSON("", userData);
  }, [userData]);

  /* Events */
  const onChangeText = (text: string, textKey: UserDataKeys) => {
    const data: UserData = {
      ...userData,
      [textKey]: text,
    };
    setUserData(data);
  };

  const onPressSignUp = () => {
    // TODO: When user is being created, you should check if username or e-mail is existed already and if it's
    // interrupt the registration.
    // And you should check this in database function, and also validation. If validation does not allow,
    // then form can't be completed.
    // realm.write(() => {
    //   realm.create("User", User.create("Efe", "KARAKAYA", "efefurkankarakaya@outlook.com", "1234"));
    // });
    createUser(realm, userData);

    navigation.navigate("Login");
  };
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

      {/* User Name */}
      <CustomTextInput
        textInputProps={{
          placeholder: "User Name",

          onChangeText: (text: string) => onChangeText(text, "userName"),
          value: userData.userName,
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
