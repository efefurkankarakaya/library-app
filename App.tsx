import { useCallback } from "react";
import { View } from "react-native";

// Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./src/types/navigationTypes";

// Expo
import { StatusBar } from "expo-status-bar";
import { useFonts, Montserrat_400Regular, Montserrat_100Thin } from "@expo-google-fonts/montserrat";
import * as SplashScreen from "expo-splash-screen";

// Redux
import { Provider } from "react-redux";
import { store } from "./src/store/store";

// Screensa
import LoginScreen from "./src/screens/auth/LoginScreen";

import AppStyles from "./App.style";
import HomeScreen from "./src/screens/home";
// https://reactnative.dev/docs/environment-setup?guide=quickstart&package-manager=npm
// https://reactnative.dev/docs/typescript
// https://docs.expo.dev/workflow/customizing/
// https://docs.expo.dev/guides/environment-variables/

const RootStack = createNativeStackNavigator<RootStackParamList>();

SplashScreen.preventAutoHideAsync();

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
    <View style={AppStyles.container} onLayout={onLayoutRootView}>
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
        </RootStack.Navigator>
      </NavigationContainer>
    </View>
  );
};

/**
 * @note Root allows to use store in <App /> component.
 */
const Root: React.FC = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default Root;
