import { SafeAreaView, Text, TextInput, View } from "react-native";
import { Image } from "expo-image";
import LibIcon from "../../../../assets/lib3.jpg";

import CustomTextInput from "../../../components/CustomTextInput";
import Style from "./LoginScreen.style";
import CustomText from "../../../components/CustomText";
import CustomButton from "../../../components/CustomButton";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../types/navigationTypes";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { logIn, logOut } from "../../../store/slices/userSlice";

// const blurhash =
//   "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

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

  return (
    <SafeAreaView style={Style.container}>
      {/* <Image style={Style.image} source={LibIcon} placeholder={blurhash} contentFit="cover" transition={1000} /> */}
      <CustomText customTextStyle={Style.title}>Logo</CustomText>
      <CustomTextInput label="E-mail" />
      <CustomTextInput label="Password" />
      <CustomButton touchableOpacityProps={{ onPress: onPressLogin }}>Login</CustomButton>
      <CustomButton>Forgot password?</CustomButton>
      <CustomButton touchableOpacityProps={{ onPress: onPressSignUp }}>Sign Up</CustomButton>
    </SafeAreaView>
  );
};

export default LoginScreen;
