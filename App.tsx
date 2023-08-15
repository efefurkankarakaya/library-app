/* Core */
import { useCallback } from "react";
import { View } from "react-native";

/* Navigation */
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BottomTabBarProps, BottomTabNavigationProp, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomTabParamList, RootStackParamList, RootStackScreenProps } from "./src/types/navigationTypes";

/* Expo */
import { StatusBar } from "expo-status-bar";
import { useFonts, Montserrat_400Regular, Montserrat_100Thin } from "@expo-google-fonts/montserrat";
import * as SplashScreen from "expo-splash-screen";

/**
 WARN  https://github.com/realm/realm-js/issues/3714
 BSON: For React Native please polyfill crypto.getRandomValues, 
 e.g. using: https://www.npmjs.com/package/react-native-get-random-values.
*/

/* Dependency */
import "react-native-get-random-values"; // NOTE: Do not use with expo-crypto, causes the error below (in Realm functions).
/**
 * [Error: Exception in HostFunction: unordered_map::at: key not found]
 */

/* Database */
import { AppRealmContext } from "./src/models";

/* Store */
import { Provider } from "react-redux";
import { store } from "./src/store/store";

/* Screens */
import LoginScreen from "./src/screens/auth/LoginScreen";
import HomeScreen from "./src/screens/home";
import SignUpScreen from "./src/screens/auth/SignUpScreen";

/* Style */
import AppStyle from "./App.style";

// https://reactnative.dev/docs/environment-setup?guide=quickstart&package-manager=npm
// https://reactnative.dev/docs/typescript
// https://docs.expo.dev/workflow/customizing/
// https://docs.expo.dev/guides/environment-variables/

const RootStack = createNativeStackNavigator<RootStackParamList>();
const BottomTab = createBottomTabNavigator<BottomTabParamList>();

// Common options for navigation display
const DefaultNavigatorScreenOptions = {
  title: "",
  headerTransparent: true,
  headerShown: false,
};

// Used in the root stack navigator
const RootStackNavigatorScreenOptions = {
  ...DefaultNavigatorScreenOptions, // Removes the top navigator's header.
};

// Used in authentication page's general navigator
const StackNavigatorScreenOptions = {
  ...DefaultNavigatorScreenOptions,
  headerShown: true, // Header is allowed in authentication pages other than login page.
};

// Used in authentication/login page's navigator
const StackScreenLoginOptions = {
  headerShown: false, // To remove header from login screen.
};

const BottomTabNavigatorScreenOptions = {
  // TODO: Use icons for bottom navigation instead of their titles.
  // title: "",
  headerShown: false,
  headerTransparent: true,
};

const AuthenticationStackNavigation = (): JSX.Element => {
  // "Best practises when nesting" -> https://reactnavigation.org/docs/nesting-navigators/
  return (
    <RootStack.Navigator initialRouteName="Login" screenOptions={StackNavigatorScreenOptions}>
      <RootStack.Screen name="Login" component={LoginScreen} options={StackScreenLoginOptions} />
      <RootStack.Screen name="SignUp" component={SignUpScreen} />
      {/* <RootStack.Screen name="ForgotPassword" component={SignUpScreen} options={StackScreenOptions} /> */}
    </RootStack.Navigator>
  );
};

const MainAppBottomNavigation = (): JSX.Element => {
  return (
    <BottomTab.Navigator initialRouteName="Home" screenOptions={BottomTabNavigatorScreenOptions}>
      <BottomTab.Screen name="Home" component={HomeScreen} />
      <BottomTab.Screen name="Search" component={HomeScreen} />
      <BottomTab.Screen name="Activities" component={HomeScreen} />
      <BottomTab.Screen name="Profile" component={HomeScreen} />
    </BottomTab.Navigator>
  );
};

SplashScreen.preventAutoHideAsync();

// TODO: https://stackoverflow.com/questions/63159757/change-the-default-light-grey-background-color
// TODO: https://reactnavigation.org/docs/stack-navigator/#animation-related-options

// https://reactnative.dev/docs/testing-overview
const App: React.FC<JSX.Element> = (): JSX.Element | null => {
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
        <RootStack.Navigator initialRouteName="Authentication" screenOptions={RootStackNavigatorScreenOptions}>
          <RootStack.Screen name="Authentication" component={AuthenticationStackNavigation} />
          <RootStack.Screen name="MainApp" component={MainAppBottomNavigation} />
        </RootStack.Navigator>
      </NavigationContainer>
    </View>
  );
};

/**
 * @note Root allows to use application-level implementations.
 */
const Root: React.FC<JSX.Element> = (): JSX.Element => {
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
        <App key={null} type={null} props={null} />
      </Provider>
    </RealmProvider>
    // </AppProvider>
  );
};

export default Root;
