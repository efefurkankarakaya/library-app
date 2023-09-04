import { SafeAreaView, Text, View } from "react-native";
import { CustomText, TextButton } from "../../../components";
import { useAppDispatch } from "../../../store/hooks";
import { resetActiveUser } from "../../../store/slices/userSlice";
import Style from "./index.style";

function SettingsScreen({ navigation }) {
  const dispatch = useAppDispatch();

  const onPressLogOut = () => {
    dispatch(resetActiveUser());
    navigation.navigate("Authentication", { screen: "LoginScreen" });
  };

  return (
    <SafeAreaView style={Style.container}>
      <Text style={Style.header}>Settings</Text>
      <View>
        <TextButton
          touchableOpacityProps={{
            onPress: onPressLogOut,
          }}
        >
          Log out
        </TextButton>
      </View>
    </SafeAreaView>
  );
}

export default SettingsScreen;
