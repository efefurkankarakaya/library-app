/* Core */
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

/* Custom Components */
import CustomText from "../../components/CustomText";

/* Store */
import { useAppSelector } from "../../store/hooks";

const HomeScreen = ({ navigation }) => {
  const user = useAppSelector(({ user }) => user);

  useEffect(() => {
    /* TODO: During the development, state can change and user login status turned to be false when hot reload runs but what if it happens in production? */
    if (!user.isLoggedIn) {
      navigation.navigate("Authentication", { screen: "Login" });
    }
  }, [user]);
  console.log(user);

  return (
    <SafeAreaView>
      <CustomText>Home</CustomText>
    </SafeAreaView>
  );
};

export default HomeScreen;
