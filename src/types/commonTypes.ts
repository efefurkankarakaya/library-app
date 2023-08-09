import { ShadowStyleIOS, StyleProp } from "react-native";

export type TStyleSheet = StyleProp<object>;

/* Text Input */
export interface onFocusStyleProps extends Partial<ShadowStyleIOS> {
  borderColor?: string;
  borderRadius?: number;
  borderWidth?: number;
}

/* Sign Up Page */
export interface UserData {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}
