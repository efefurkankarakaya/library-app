import type { StackScreenProps } from "@react-navigation/stack";

// https://reactnavigation.org/docs/typescript/

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  // Profile: { userId: string };
  // Feed: { sort: "latest" | "top" } | undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = StackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
