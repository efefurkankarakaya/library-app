import { StyleProp, StyleSheet } from "react-native";

// Type Definitions
type TStyleSheet = StyleProp<object>;
// type TInitial = TStyleSheet | TStyleSheet[];
type TStyle = TStyleSheet | TStyleSheet[];

// Function Definitions
type TCombineStyles = (initial: TStyle, upcoming: TStyle) => TStyle;

/**
 * @param {TStyle} initial - StyleSheet object or an array of StyleSheet objects.
 * @param {TStyle} upcoming - The StyleSheet object to be combined with initial StyleSheets.
 * @returns {TStyle} - Returns a merged version of all styles.
 */
export const combineStyles: TCombineStyles = (initial: TStyle, upcoming: TStyle): TStyle => {
  /**
   * Upcoming style can be falsy to not to break custom components
   * because these components have optional style props.
   * And, initial can not be a falsy value to prevent merge styles with falsy values.
   */
  if (!initial) {
    throw Error("Initial StyleSheet can't be a falsy value.");
  }

  /* If there'll be components without style, this condition can cause trouble in future. */
  /* const combinedLabelStyle = combineStyles([], Style.label); */
  // if (isArrayEmpty(initial)) {
  //   throw Error("Initial StyleSheet can't be an empty array.");
  // }

  if (!upcoming) {
    /* Prevents merging with falsy or unexpected values */
    return [initial];
  }

  return StyleSheet.flatten([initial, upcoming]);
};
