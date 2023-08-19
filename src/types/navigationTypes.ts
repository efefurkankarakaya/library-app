import type { StackScreenProps } from "@react-navigation/stack";

// https://reactnavigation.org/docs/typescript/

export type RootStackParamList = {
  // To reduce performance impacts, instead of creating a new NativeStackNavigator, using the current one for the root component and the auth screens.
  Login: undefined;
  SignUp: undefined;
  Authentication: undefined;
  MainApp: undefined;
  // Profile: { userId: string };
  // Feed: { sort: "latest" | "top" } | undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Search: undefined;
  Activities: undefined;
  Profile: undefined;
};

export interface MainStackParamList extends RootStackParamList, BottomTabParamList {}

export type RootStackScreenProps<T extends keyof RootStackParamList> = StackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
