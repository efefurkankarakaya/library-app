/* Expo */
import * as Crypto from "expo-crypto";

/* Database */
import { Results } from "realm";
import User from "../models/User";

/* Others */
import { validateEmailAddress } from "./validationHelpers";
import { logWithTime } from "../utils/utils";

export async function authenticate(users: Results<User>, email: string, password: string): Promise<boolean> {
  let isAuthenticated = false;

  // If e-mail is not valid, then reject immediately.
  if (!email || !validateEmailAddress(email) || !password) {
    logWithTime("Login attempt with incorrect format.");
    return isAuthenticated;
  }

  const encryptEnteredPassword = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
  const user = users.find((user) => user.email === email);

  if (user && encryptEnteredPassword === user.password) {
    logWithTime("Password is correct!");
    isAuthenticated = true;
  }

  return isAuthenticated;
}
