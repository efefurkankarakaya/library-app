import { SafeAreaView } from "react-native";

// Navigation
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../types/navigationTypes";

// Custom Components
import CustomText from "../../../components/CustomText";
import CustomTextInput from "../../../components/CustomTextInput";
import CustomButton from "../../../components/CustomButton";

import Style from "./SignUpScreen.style";

interface SignUpScreenProps {
  navigation: NavigationProp<RootStackParamList>;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }: SignUpScreenProps) => {
  const onPressSignUp = () => {
    navigation.navigate("Login");
  };
  // https://www.mongodb.com/docs/realm/sdk/react-native/
  // https://www.mongodb.com/docs/realm/sdk/react-native/manage-users/manage-email-password-users/
  // https://realm.io/?utm_source=google&utm_campaign=search_gs_pl_evergreen_realm_product_prosp-brand_gic-null_ww-multi_ps-all_desktop_eng_lead&utm_term=realm&utm_medium=cpc_paid_search&utm_ad=p&utm_ad_campaign_id=11303420057&adgroup=132586004050&cq_cmp=11303420057&gad=1&gclid=EAIaIQobChMIlr_4rb_P_wIVsItoCR0b9gmnEAAYASAAEgIKw_D_BwE
  // https://reactnative.dev/docs/textinput
  return (
    <SafeAreaView style={Style.container}>
      <CustomTextInput textInputProps={{ placeholder: "First Name" }} />
      <CustomTextInput textInputProps={{ placeholder: "Last Name" }} />
      <CustomTextInput textInputProps={{ placeholder: "E-mail Address", keyboardType: "email-address" }} />
      <CustomTextInput textInputProps={{ placeholder: "Password", secureTextEntry: true }} />
      {/* // TODO: Add show password button */}
      {/* TODO: Commonize password and e-mail props with login page */}
      <CustomButton touchableOpacityProps={{ onPress: onPressSignUp }}>Sign Up</CustomButton>
    </SafeAreaView>
  );
};

export default SignUpScreen;
