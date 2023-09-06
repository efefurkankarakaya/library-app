/* Core */
import { useCallback } from "react";
import { View } from "react-native";

/* Navigation */
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomTabParamList, RootStackParamList } from "./src/types/navigationTypes";

/* Expo */
import { StatusBar } from "expo-status-bar";
import { useFonts, Montserrat_400Regular, Montserrat_600SemiBold } from "@expo-google-fonts/montserrat";
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
import { LoginScreen, SignUpScreen, HomeScreen, CamScreen, DetailsScreen, MyBooksScreen, SettingsScreen } from "./src/screens";

/* Style */
import AppStyle from "./App.style";
import { IconColor, TextColor } from "./src/common/colorPalette";
import { HomeIcon, BookIcon, SettingsIcon } from "./assets";

// https://reactnative.dev/docs/environment-setup?guide=quickstart&package-manager=npm
// https://reactnative.dev/docs/typescript
// https://docs.expo.dev/workflow/customizing/
// https://docs.expo.dev/guides/environment-variables/

// TODO: In android build, when keyboard opens, page does not slide

// TODO: Move configurations outside
// TODO: Move navigation components to navigations/ or App.navigation.ts
const RootStack = createStackNavigator<RootStackParamList>();
const BottomTab = createBottomTabNavigator<BottomTabParamList>();

/* ================ Screen Options ================ */
// Common options for navigation display
const DefaultNavigatorScreenOptions = {
  title: "",
  headerTransparent: true,
  headerShown: false,
  headerTintColor: TextColor.urlBlue,
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
  ...DefaultNavigatorScreenOptions,
  // title: "",
  // headerShown: false,
  // headerTransparent: true,
  tabBarStyle: {
    backgroundColor: DefaultTheme.colors.background /* color: 'transparent' does not work as expected in Android here. */,
  },
};

const MainAppNavigatorScreenOptions = {
  ...DefaultNavigatorScreenOptions,
};

const DetailsScreenOptions = {
  headerShown: true,
};
/* ================ End ================ */

/* ================ Navigations ================ */
const AuthenticationStackNavigation = (): JSX.Element => {
  // "Best practises when nesting" -> https://reactnavigation.org/docs/nesting-navigators/
  return (
    <RootStack.Navigator initialRouteName="LoginScreen" screenOptions={StackNavigatorScreenOptions}>
      <RootStack.Screen name="LoginScreen" component={LoginScreen} options={StackScreenLoginOptions} />
      <RootStack.Screen name="SignUpScreen" component={SignUpScreen} />
      {/* <RootStack.Screen name="ForgotPassword" component={SignUpScreen} options={StackScreenOptions} /> */}
    </RootStack.Navigator>
  );
};

const getBottomIconColor = (focused: boolean) => (focused ? IconColor.black : IconColor.grey); // TODO: Move outside

const MainAppBottomNavigation = (): JSX.Element => {
  return (
    <BottomTab.Navigator initialRouteName="HomeScreen" screenOptions={BottomTabNavigatorScreenOptions}>
      <BottomTab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <HomeIcon fill={getBottomIconColor(focused)} />,
        }}
      />
      <BottomTab.Screen
        name="MyBooksScreen"
        component={MyBooksScreen}
        options={{
          tabBarIcon: ({ focused }) => <BookIcon fill={getBottomIconColor(focused)} />,
        }}
      />
      <BottomTab.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => <SettingsIcon fill={getBottomIconColor(focused)} height={24} />,
        }}
      />
    </BottomTab.Navigator>
  );
};

const MainAppNavigation = (): JSX.Element => {
  return (
    <RootStack.Navigator initialRouteName="MainAppBottomNavigation" screenOptions={MainAppNavigatorScreenOptions}>
      <RootStack.Screen name="MainAppBottomNavigation" component={MainAppBottomNavigation} />
      {/* TODO: https://stackoverflow.com/questions/48018666/how-to-change-the-direction-of-the-animation-in-stacknavigator */}
      {/* TODO: https://itnext.io/change-react-native-screen-animation-direction-with-react-navigation-8cec0f66f22 */}
      <RootStack.Screen
        name="CamScreen"
        component={CamScreen}
        // TODO: Gesture Direction doesn't work on Android.
        // TODO: https://reactnavigation.org/docs/stack-navigator/#animation-related-options
        options={{
          gestureDirection: "horizontal-inverted",
        }}
      />
      <RootStack.Screen name="DetailsScreen" component={DetailsScreen} options={DetailsScreenOptions} />
    </RootStack.Navigator>
  );
};
/* ================ End ================ */

/** Splash Screen
 * https://blog.logrocket.com/building-splash-screens-react-native/
 * https://www.npmjs.com/package/react-native-splash-screen
 * TODO: Add an splash screen (with setTimeout or interval to replicate an real app scenario.)
 */
SplashScreen.preventAutoHideAsync();

/** App Color
 * https://reactnavigation.org/docs/themes/
 * https://stackoverflow.com/questions/63159757/change-the-default-light-grey-background-color
 */

const App: React.FC<JSX.Element> = (): JSX.Element | null => {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
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
          {/* TODO: Prevent going back -> https://reactnavigation.org/docs/preventing-going-back/ */}
          <RootStack.Screen name="Authentication" component={AuthenticationStackNavigation} />
          <RootStack.Screen name="MainApp" component={MainAppNavigation} />
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
