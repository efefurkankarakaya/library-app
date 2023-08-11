import { SafeAreaView, View } from "react-native";
import { Image } from "expo-image";
import LibIcon from "../../../../assets/lib-clean.png";

import CustomTextInput from "../../../components/CustomTextInput";
import Style from "./LoginScreen.style";
import CustomText from "../../../components/CustomText";
import CustomButton from "../../../components/CustomButton";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../types/navigationTypes";
import { useAppDispatch } from "../../../store/hooks";
import { logIn, logOut } from "../../../store/slices/userSlice";
import { AppRealmContext } from "../../../models";
import User from "../../../models/User";
import { logWithTime } from "../../../utils/utils";
import { useEffect, useState } from "react";
import ValidatorTextInput from "../../../components/ValidatorTextInput";
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
    dispatch(logOut());
  }, []);

  const onPressLogin = () => {
    authenticate(users, loginData.email, loginData.password)
      .then((result) => {
        /* Normal flow */
        setIsAuthenticated(result);
        setIsSubmitted(true);

        if (result) {
          dispatch(logIn());
          navigation.navigate("MainApp", { screen: "Home" });
        }
      })
      .catch((error) => logWithTime("Authentication failed: " + error.message));
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
      {/* <CustomText customTextStyle={Style.title}>Logo</CustomText> */}
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
      <CustomButton touchableOpacityProps={{ onPress: onPressLogin }} customButtonStyle={Style.loginButton}>
        Login
      </CustomButton>
      <CustomButton
        touchableOpacityProps={{
          onPress: onPressForgotPassword,
        }}
        customButtonStyle={Style.forgotPasswordButton}
        customTextStyle={Style.forgotPasswordText}
      >
        Forgot password?
      </CustomButton>
      <View style={Style.signUpContainer}>
        <CustomText>
          Still not have an account? <CustomText></CustomText>
        </CustomText>

        <CustomButton
          touchableOpacityProps={{ onPress: onPressSignUp }}
          customButtonStyle={Style.signUpButton}
          customTextStyle={Style.signUpText}
        >
          Sign up
        </CustomButton>
        <CustomText> now.</CustomText>
      </View>
      {/* https://stackoverflow.com/questions/39344140/react-native-how-to-control-what-keyboard-pushes-up */}
      {/* AndroidManifest.xml -> android:windowSoftInputMode="adjustPan" */}
      {/* Another solution is wrapping all the component with KeyboardAvoidingView: https://reactnative.dev/docs/keyboardavoidingview */}
      <View style={Style.footer}>
        <CustomText customTextStyle={Style.footerText}>Library Inc.</CustomText>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
