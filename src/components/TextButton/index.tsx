/* Custom Components */
import CustomButton from "../CustomButton";

/* Style */
import Style from "./index.style";
import { combineStyles } from "../../helpers/styleHelpers";

/* Types */
import { CustomButtonProps } from "../../types/componentProps";

interface TextButtonProps extends CustomButtonProps {}

const TextButton: React.FC<TextButtonProps> = ({
  children,
  buttonStyle,
  textStyle,
  touchableOpacityProps,
  textProps,
}: TextButtonProps): JSX.Element => {
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

export default TextButton;
