/* Core */
import { useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";

/* Navigation */
import type { NavigationProp } from "@react-navigation/native";

/* Expo */
import { Image } from "expo-image";

/* Custom Components */
import { CustomTextInput, CustomText, CustomButton, ValidatorTextInput, TextButton } from "../../../components";

/* Store */
import { useAppDispatch } from "../../../store/hooks";
import { grantPermission, logIn, logOut, revokePermission } from "../../../store/slices/userSlice";

/* Database */
import { AppRealmContext } from "../../../models";
import User from "../../../models/User";

/* Style */
import Style from "./index.style";
import LibIcon from "../../../../assets/lib-clean.png";

/* Types */
import { RootStackParamList } from "../../../types/navigationTypes";

/* Others */
import { logWithTime } from "../../../utils/utils";
import { authenticate } from "../../../helpers/authHelpers";

interface LoginData {
  email: string;
  password: string;
}

type LoginDataKeys = keyof LoginData;

// TODO: Do I really need this?
const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

interface LoginScreenProps {
  navigation: NavigationProp<RootStackParamList>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  // const user = useAppSelector(({ user }) => user);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const { useQuery } = AppRealmContext;
  const users = useQuery(User);

  useEffect(() => {
    // TODO: This can cause unpredictable problems related to login options like 'Remember Me' in the future.
    dispatch(logOut()); // TODO: If user is authenticated, then user should never see login page until logged out.
    dispatch(revokePermission());
  }, []);

  const onPressLogin = (): void => {
    authenticate(users, loginData.email, loginData.password)
      .then((result) => {
        /* Regular flow, function worked but authentication can fail in user side. */
        const { isAuthenticated, isSU } = result;
        setIsAuthenticated(isAuthenticated);
        setIsSubmitted(true);

        /* If user authenticated */
        if (result.isAuthenticated) {
          isSU && dispatch(grantPermission());
          dispatch(logIn());
          // @ts-ignore: https://reactnavigation.org/docs/nesting-navigators/#passing-params-to-a-screen-in-a-nested-navigator
          navigation.navigate("MainApp", { screen: "Home" });
        }
      })
      .catch((error) =>
        /* Error flow, function or authentication process does not work as expected and throws error. */
        logWithTime("Authentication process failed: " + error.message)
      );
  };

  const onPressSignUp = () => {
    navigation.navigate("SignUp");
  };

  const onPressForgotPassword = () => {
    // TODO: Navigate to Forgot Password
  };

  /* On Change Main Handler */
  const onChangeText = (text: string, textKey: LoginDataKeys) => {
    const pureText: string = text;

    let processedText: string = pureText;

    const data: LoginData = {
      ...loginData,
      [textKey]: processedText,
    };

    setIsSubmitted(false);
    setLoginData(data);
  };

  return (
    <SafeAreaView style={Style.container}>
      <Image style={Style.image} source={LibIcon} placeholder={blurhash} contentFit="cover" transition={1000} />
      {/* <CustomText textStyle={Style.title}>Logo</CustomText> */}
      {/* TODO: Set e-mail address here after registration */}
      {/* TODO: Add Remember me */}
      <CustomTextInput
        label="E-mail"
        textInputProps={{
          keyboardType: "email-address",
          onChangeText: (text: string) => onChangeText(text, "email"),
          value: loginData.email,
          inputMode: "email",
        }}
        customContainerStyle={Style.email}
      />
      <ValidatorTextInput
        label="Password"
        isDataOK={false}
        activateSublabel={true}
        showSublabel={isSubmitted}
        sublabel={!isAuthenticated ? "Invalid e-mail address or password." : ""}
        textInputProps={{
          secureTextEntry: true,
          onChangeText: (text: string) => onChangeText(text, "password"),
          value: loginData.password,
        }}
        customContainerStyle={Style.password}
      />
      <CustomButton touchableOpacityProps={{ onPress: onPressLogin }} buttonStyle={Style.loginButton}>
        Login
      </CustomButton>
      <TextButton
        touchableOpacityProps={{
          onPress: onPressForgotPassword,
        }}
        buttonStyle={Style.forgotPasswordButton}
        textStyle={Style.forgotPasswordText}
      >
        Forgot password?
      </TextButton>
      <View style={Style.signUpContainer}>
        <CustomText>
          Still not have an account? <CustomText></CustomText>
        </CustomText>

        <TextButton touchableOpacityProps={{ onPress: onPressSignUp }} buttonStyle={Style.signUpButton} textStyle={Style.signUpText}>
          Sign up
        </TextButton>
        <CustomText> now.</CustomText>
      </View>
      {/* https://stackoverflow.com/questions/39344140/react-native-how-to-control-what-keyboard-pushes-up */}
      {/* AndroidManifest.xml -> android:windowSoftInputMode="adjustPan" */}
      {/* Another solution is wrapping all the component with KeyboardAvoidingView: https://reactnative.dev/docs/keyboardavoidingview */}
      <View style={Style.footer}>
        <CustomText textStyle={Style.footerText}>Library Inc.</CustomText>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
