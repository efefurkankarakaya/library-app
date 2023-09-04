import { isIOS } from "./common";

export const MainAppDefaultContainerStyle = {
  flex: 1,
  margin: 20,
  marginTop: isIOS ? 20 : 50,
};

export const MainAppDefaultHeaderStyle = {
  fontSize: 32,
  fontWeight: "600",
};
