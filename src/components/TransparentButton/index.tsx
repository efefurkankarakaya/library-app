/* Custom Components */
import CustomButton from "../CustomButton";

/* Style */
import Style from "./index.style";

/* Others */
import { combineStyles } from "../../helpers/styleHelpers";
import { CustomButtonProps } from "../../types/componentProps";

interface TransparentButtonProps extends CustomButtonProps {}

const TransparentButton = ({ children, buttonStyle, textStyle, touchableOpacityProps, textProps }: TransparentButtonProps) => {
  const combinedButtonStyle = combineStyles(Style.button, buttonStyle);
  const combinedTextStyle = combineStyles(Style.text, textStyle);

  return (
    <CustomButton
      buttonStyle={combinedButtonStyle}
      textStyle={combinedTextStyle}
      touchableOpacityProps={touchableOpacityProps}
      textProps={textProps}
    >
      {children}
    </CustomButton>
  );
};

export default TransparentButton;
