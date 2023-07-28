import { ShadowStyleIOS, StyleProp } from "react-native";

export type TStyleSheet = StyleProp<object>;

/* Text Input */
export interface onFocusStyleProps extends Partial<ShadowStyleIOS> {
  borderColor?: string;
  borderRadius?: number;
  borderWidth?: number;
}
