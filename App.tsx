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

/*
  WARN  https://github.com/realm/realm-js/issues/3714
  BSON: For React Native please polyfill crypto.getRandomValues, 
  e.g. using: https://www.npmjs.com/package/react-native-get-random-values.
*/
import "react-native-get-random-values";

// Database
// import Realm from "realm";
// import { createRealmContext } from "@realm/react";
// import User from "./src/models/User";

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

// const realmConfig: Realm.Configuration = {
//   path: "database.realm",
//   schema: [User],
// };

// const { RealmProvider, useRealm, useObject, useQuery } = createRealmContext(realmConfig);

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
      <NavigationContainer>
        <RootStack.Navigator initialRouteName="Login">
          <RootStack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              title: "Login",
            }}
          />
          <RootStack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: "Home",
            }}
          />
          <RootStack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{
              title: "Sign Up",
            }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </View>
  );
};

/**
 * @note Root allows to use store in <App /> component.
 */
const Root: React.FC = () => {
  const { RealmProvider } = AppRealmContext;

  return (
    <RealmProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </RealmProvider>
  );
};

export default Root;
