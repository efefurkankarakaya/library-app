import { Text } from "react-native";
import Style from "./CustomText.style";
import { TStyleSheet } from "../../types/commonTypes";
import { combineStyles } from "../../helpers/styleHelpers";
import { ReactNode } from "react";

interface CustomTextProps {
  children?: ReactNode;
  customTextStyle?: TStyleSheet;
}

const CustomText: React.FC<CustomTextProps> = ({ children, customTextStyle, ...restTextProps }: CustomTextProps) => {
  const combinedTextStyle = combineStyles(Style.text, customTextStyle);

  return (
    <Text style={combinedTextStyle} {...restTextProps}>
      {children}
    </Text>
  );
};

export default CustomText;
