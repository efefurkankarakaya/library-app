import type { StackScreenProps } from "@react-navigation/stack";

// https://reactnavigation.org/docs/typescript/

export type RootStackParamList = {
  // To reduce performance impacts, instead of creating a new NativeStackNavigator, using the current one for the root component and the auth screens.
  LoginScreen: undefined;
  SignUpScreen: undefined;
  Authentication: undefined;
  MainApp: undefined;
  MainAppBottomNavigation: undefined;
  CamScreen: undefined; // TODO: Refactor
  DetailsScreen: undefined;
};

export type BottomTabParamList = {
  HomeScreen: undefined;
  MyBooksScreen: undefined;
  SettingsScreen: undefined;
};

export interface MainStackParamList extends RootStackParamList, BottomTabParamList {}

export type RootStackScreenProps<T extends keyof RootStackParamList> = StackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
