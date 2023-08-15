/* Core */
import { ReactNode } from "react";
import { Text } from "react-native";

/* Style */
import Style from "./CustomText.style";

/* Types */
import { TStyleSheet } from "../../types/commonTypes";

/* Others */
import { combineStyles } from "../../helpers/styleHelpers";

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
