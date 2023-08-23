/* Core */
import { ReactNode } from "react";
import { Text } from "react-native";

/* Style */
import Style from "./index.style";

/* Types */
import { TStyleSheet } from "../../types/commonTypes";

/* Others */
import { combineStyles } from "../../helpers/styleHelpers";

interface CustomTextProps {
  children?: ReactNode;
  textStyle?: TStyleSheet;
}

const CustomText: React.FC<CustomTextProps> = ({ children, textStyle, ...restTextProps }: CustomTextProps) => {
  const combinedTextStyle = combineStyles(Style.text, textStyle);

  return (
    <Text style={combinedTextStyle} {...restTextProps}>
      {children}
    </Text>
  );
};

export default CustomText;
