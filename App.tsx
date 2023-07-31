// React & React Native
import { useCallback } from "react";
import { View } from "react-native";

// Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./src/types/navigationTypes";

// Expo Tools
import { StatusBar } from "expo-status-bar";
import { useFonts, Montserrat_400Regular, Montserrat_100Thin } from "@expo-google-fonts/montserrat";
import * as SplashScreen from "expo-splash-screen";

/**
 WARN  https://github.com/realm/realm-js/issues/3714
 BSON: For React Native please polyfill crypto.getRandomValues, 
 e.g. using: https://www.npmjs.com/package/react-native-get-random-values.
*/

import "react-native-get-random-values"; // NOTE: Do not use with expo-crypto, causes the error below (in Realm functions).
/**
 * [Error: Exception in HostFunction: unordered_map::at: key not found]
 */

// Redux
import { Provider } from "react-redux";
import { store } from "./src/store/store";

// Screens
import LoginScreen from "./src/screens/auth/LoginScreen";
import HomeScreen from "./src/screens/home";
import SignUpScreen from "./src/screens/auth/SignUpScreen";

import AppStyle from "./App.style";
import { AppRealmContext } from "./src/models";

// https://reactnative.dev/docs/environment-setup?guide=quickstart&package-manager=npm
// https://reactnative.dev/docs/typescript
// https://docs.expo.dev/workflow/customizing/
// https://docs.expo.dev/guides/environment-variables/

const RootStack = createNativeStackNavigator<RootStackParamList>();

SplashScreen.preventAutoHideAsync();

// TODO: https://stackoverflow.com/questions/63159757/change-the-default-light-grey-background-color
// TODO: https://reactnavigation.org/docs/stack-navigator/#animation-related-options

// TODO: A top navigation bar required to go back. After that, check the margin and paddings again.

const StackScreenOptions = {
  title: "",
  headerTransparent: true,
};

// https://reactnative.dev/docs/testing-overview
const App: React.FC = () => {
  const [fontsLoaded] = useFonts({
    // Montserrat_100Thin,
    Montserrat_400Regular,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={AppStyle.container} onLayout={onLayoutRootView}>
      <StatusBar />
      <NavigationContainer>
        <RootStack.Navigator initialRouteName="Login">
          <RootStack.Screen name="Login" component={LoginScreen} options={StackScreenOptions} />
          <RootStack.Screen name="Home" component={HomeScreen} options={StackScreenOptions} />
          <RootStack.Screen name="SignUp" component={SignUpScreen} options={StackScreenOptions} />
        </RootStack.Navigator>
      </NavigationContainer>
    </View>
  );
};

/**
 * @note Root allows to use application-level implementations.
 */
const Root: React.FC = () => {
  const { RealmProvider } = AppRealmContext;

  return (
    /**
     * (Migration from local database functions to cloud functions)
     * https://www.mongodb.com/docs/realm/sdk/react-native/manage-users/manage-email-password-users/#confirm-a-new-user-s-email-address
     * https://www.mongodb.com/docs/atlas/app-services/authentication/email-password/#std-label-email-password-authentication
     */
    // <AppProvider id=""> /* to use Cloud Functions (e-mail confirmation, SSO, ..), app needs to be registered on Atlas to have a valid ID. */
    <RealmProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </RealmProvider>
    // </AppProvider>
  );
};

export default Root;
