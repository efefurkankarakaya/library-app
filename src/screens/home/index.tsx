import { SafeAreaView } from "react-native-safe-area-context";
import CustomText from "../../components/CustomText";
import { useAppSelector } from "../../store/hooks";

const HomeScreen = () => {
  const user = useAppSelector(({ user }) => user);
  console.log(user);

  return (
    <SafeAreaView>
      <CustomText>Home</CustomText>
    </SafeAreaView>
  );
};

export default HomeScreen;
