import { ImagePickerAsset } from "expo-image-picker";
import { ShadowStyleIOS, StyleProp } from "react-native";

export type TBase64 = ImagePickerAsset["base64"];
export type TStyleSheet = StyleProp<object>;

/* Text Input */
export interface onFocusStyleProps extends Partial<ShadowStyleIOS> {
  borderColor?: string;
  borderRadius?: number;
  borderWidth?: number;
}

/* Sign Up Page */
export interface UserData {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface BookData {
  bookName: string;
  bookImage: TBase64;
  bookDescription?: string;
  isbn: string;
  authors: string;
  genres: string;
  isHardcover: boolean;
}

export interface BookDataComplete extends BookData {
  _id: Realm.BSON.ObjectId;
}
