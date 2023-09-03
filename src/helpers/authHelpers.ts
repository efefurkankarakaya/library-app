/* Expo */
import * as Crypto from "expo-crypto"; // TODO: Import functions only

/* Database */
import { Results } from "realm";
import User from "../models/User";

/* Others */
import { validateEmailAddress } from "./validationHelpers";
import { logWithTime } from "../utils/utils";
import { UserDataComplete } from "../types/commonTypes";

interface AuthData {
  isAuthenticated: boolean;
  isSU: boolean;
  user: Partial<UserDataComplete>;
}

export async function authenticate(users: Results<User>, email: string, password: string): Promise<AuthData> {
  const authData: AuthData = {
    isAuthenticated: false,
    isSU: false,
    user: {},
  };

  // If e-mail or password is not valid, then reject immediately.
  if (!email || !validateEmailAddress(email) || !password) {
    logWithTime("Login attempt with incorrect format.");
    return authData;
  }

  const encryptEnteredPassword = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
  const user = users.find((user) => user.email === email);

  if (user && encryptEnteredPassword === user.password) {
    logWithTime("Password is correct!");
    authData.isAuthenticated = true;
    authData.isSU = user.isSU;
    authData.user._id = user._id;
    authData.user.fullName = user.fullName;
    authData.user.email = user.email;
    authData.user.phoneNumber = user.phoneNumber;
  }

  return authData;
}
