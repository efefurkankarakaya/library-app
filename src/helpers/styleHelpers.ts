import { StyleProp, StyleSheet } from "react-native";

// Type Definitions
type TStyleSheet = StyleProp<object>;
type TInitial = TStyleSheet | TStyleSheet[];
type TStyle = object | TStyleSheet;

// Function Definitions
type TCombineStyles = (initial: TInitial, styleSheet: TStyleSheet) => TStyleSheet[];

/**
 * @param {TStyleSheet | TStyleSheet[]} initial - StyleSheet object or an array of StyleSheet objects.
 * @param {TStyleSheet} style - The StyleSheet object to be combined with initial StyleSheets.
 * @returns {TStyleSheet[]} - An array of StyleSheet objects.
 */
export const combineStyles: TCombineStyles = (initial: TInitial, style: TStyle): TStyleSheet[] => {
  const styleSheet: TStyle = StyleSheet.flatten(style);

  return Array.isArray(initial) ? [...initial, styleSheet] : [initial, styleSheet];
};
