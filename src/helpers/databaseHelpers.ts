/* Expo */
import * as Crypto from "expo-crypto"; // TODO: Imports functions only

/* Database */
import User from "../models/User";

/* Types */
import { BookData, UserData } from "../types/commonTypes";

/* Others */
import { logWithTime } from "../utils/utils";
import Book from "../models/Book";

export function updateBook(realm: Realm, data: BookData | undefined, bookToBeUpdated: (Book & Realm.Object<Book, never>) | null) {
  try {
    const { bookName, bookImage, bookDescription, isbn, authors, genres } = data || {};

    realm.write(() => {
      /* @ts-ignore */
      bookToBeUpdated.bookName = bookName;
      /* @ts-ignore */
      bookToBeUpdated.bookImage = bookImage;
      /* @ts-ignore */
      bookToBeUpdated.bookDescription = bookDescription;
      /* @ts-ignore */
      bookToBeUpdated.isbn = isbn;
      /* @ts-ignore */
      bookToBeUpdated.authors = authors;
      /* @ts-ignore */
      bookToBeUpdated.genres = genres;
    });

    logWithTime("Succcessfully updated: ", bookToBeUpdated?.bookName);
  } catch (error) {
    logWithTime("[Realm | updateBook]");
    logWithTime(error);
  }
}

export function createBook(realm: Realm, data: BookData | undefined) {
  try {
    const { bookName = "", bookImage = "", bookDescription = "", isbn = "", authors = "", genres = "" } = data || {};
    const bookToBeCreated = Book.create(bookName, bookImage, bookDescription, isbn, authors, genres, false);
    realm.write(() => {
      realm.create("Book", bookToBeCreated);
      logWithTime("Succcessfully created: ", bookToBeCreated.bookName);
    });
  } catch (error) {
    logWithTime("[Realm | createBook]");
    logWithTime(error);
  }
}

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
