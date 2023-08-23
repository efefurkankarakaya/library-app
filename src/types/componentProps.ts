import type { ReactNode } from "react";
import type { TextProps, TouchableOpacityProps } from "react-native";
import { TStyleSheet } from "./commonTypes";

export interface CustomButtonProps {
  children?: ReactNode;
  textStyle?: TStyleSheet;
  buttonStyle?: TStyleSheet;
  touchableOpacityProps?: TouchableOpacityProps;
  textProps?: TextProps;
}
