import { SafeAreaView, View } from "react-native";
import { Image } from "expo-image";
import LibIcon from "../../../../assets/lib-clean.png";

import CustomTextInput from "../../../components/CustomTextInput";
import Style from "./LoginScreen.style";
import CustomText from "../../../components/CustomText";
import CustomButton from "../../../components/CustomButton";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../types/navigationTypes";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { logIn, logOut } from "../../../store/slices/userSlice";
import { TextColor } from "../../../types/colorPalette";

// TODO: Do I really need this?
const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

interface LoginScreenProps {
  navigation: NavigationProp<RootStackParamList>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(({ user }) => user);

  const onPressLogin = () => {
    navigation.navigate("Home");
    // TODO: Remove these.
    // console.log(user);
    // dispatch(logIn());
    // console.log(user);
    // dispatch(logOut());
    // console.log(user);
    // dispatch(logIn());
    // console.log(user);
  };

  const onPressSignUp = () => {
    navigation.navigate("SignUp");
  };

  const onPressForgotPassword = () => {
    // TODO: Navigate to Forgot Password
  };

  // TODO: Before adding validation here, remove top navigation bar and make one to save screen space.
  return (
    <SafeAreaView style={Style.container}>
      <Image style={Style.image} source={LibIcon} placeholder={blurhash} contentFit="cover" transition={1000} />
      {/* <CustomText customTextStyle={Style.title}>Logo</CustomText> */}
      <CustomTextInput label="E-mail" customContainerStyle={Style.email} />
      <CustomTextInput label="Password" customContainerStyle={Style.password} />
      {/* TODO: Add validation output */}
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
