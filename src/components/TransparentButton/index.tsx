/* Custom Components */
import CustomButton from "../CustomButton";

/* Style */
import Style from "./index.style";

/* Types */
import { CustomButtonProps } from "../../types/componentProps";

/* Others */
import { combineStyles } from "../../helpers/styleHelpers";

interface TransparentButtonProps extends CustomButtonProps {}

const TransparentButton: React.FC<TransparentButtonProps> = ({
  children,
  buttonStyle,
  textStyle,
  touchableOpacityProps,
  textProps,
}: TransparentButtonProps): JSX.Element => {
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
