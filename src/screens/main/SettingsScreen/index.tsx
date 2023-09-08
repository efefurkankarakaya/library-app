/* Core */
import { SafeAreaView, Text, View } from "react-native";

/* Custom Components */
import { CustomText, TextButton } from "../../../components";

/* Store */
import { useAppDispatch } from "../../../store/hooks";
import { resetActiveUser } from "../../../store/slices/userSlice";

/* Style */
import Style from "./index.style";

interface SettingScreenProps {
  navigation: any;
}

/* TODO: Add missing types */
function SettingsScreen({ navigation }: SettingScreenProps): JSX.Element {
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
