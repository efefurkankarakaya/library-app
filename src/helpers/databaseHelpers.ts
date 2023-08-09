import * as Crypto from "expo-crypto"; // TODO: Do you really need the all?

import { UserData } from "../types/commonTypes";
import { logWithTime } from "../utils/utils";
import User from "../models/User";

export async function createUser(realm: Realm, userData: UserData): Promise<void> {
  /**
   * https://stackoverflow.com/questions/1054022/best-way-to-store-password-in-database
   * https://stackoverflow.com/questions/674904/salting-your-password-best-practices
   * https://stackoverflow.com/questions/947618/how-to-best-store-user-information-and-user-login-and-password
   * https://security.stackexchange.com/questions/211/how-to-securely-hash-passwords
   */
  try {
    const { fullName, phoneNumber, email, password } = userData;

    const trimmedFullName = fullName.trim();
    const encryptedPassword = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);

    // TODO: Check if phoneNumber &| e-mail address exists

    const user = User.create(trimmedFullName, phoneNumber, email, encryptedPassword);

    realm.write(() => {
      realm.create("User", user);
      logWithTime("Succcessfully signed up: ", user.email);
    });
  } catch (error: unknown) {
    logWithTime("[Realm | createUser]");
    logWithTime(error);
  }
}
