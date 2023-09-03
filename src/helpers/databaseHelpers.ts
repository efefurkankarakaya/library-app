/* Expo */
import * as Crypto from "expo-crypto"; // TODO: Imports functions only

/* Database */
import User from "../models/User";
import Book from "../models/Book";
import Loan from "../models/Loan";

/* Types */
import { BookData, UserData } from "../types/commonTypes";

/* Others */
import { logWithTime } from "../utils/utils";

type TBookDataRef = BookData | undefined; /* To get the latest data in state, using ref instead of state */
type TBookToBeUpdated = (Book & Realm.Object<Book, never>) | null;

type TLoanObject = Loan & Realm.Object<unknown, never>;

type TRealmObjectId = Realm.BSON.ObjectId;

const CRUDErrors = {
  CreateError: "Create Error",
  UpdateError: "Update Error",
};

/**
 Loaning Operations
 */
export function removeLoan(realm: Realm, loanObject: TLoanObject) {
  try {
    realm.write(() => {
      realm.delete(loanObject);
    });
    logWithTime("Loan is removed successfully: ", loanObject._id);
  } catch (error) {
    logWithTime("[Realm | removeLoan]");
    logWithTime(error);
  }
}

export function createLoan(realm: Realm, bookId: TRealmObjectId, userId: TRealmObjectId) {
  try {
    realm.write(() => {
      realm.create("Loan", Loan.create(bookId, userId));
    });
    logWithTime("Borrowed successfully: ", bookId);
  } catch (error) {
    logWithTime("[Realm | createLoan]");
    logWithTime(error);
  }
}

/** 
 Book Operations
 * TODO: Realm does not allow more than 16 MB data, image size should be reduced if larger than 16 MB. 
 * Error: Exception in HostFunction: String too big
*/
export function updateBook(realm: Realm, data: TBookDataRef, bookToBeUpdated: TBookToBeUpdated) {
  try {
    /* Error strings for seeing if anything wrong in CRUD operations. Ref object can be undefined if something is missed during development. */
    const {
      bookName = CRUDErrors.UpdateError,
      bookImage = CRUDErrors.UpdateError,
      bookDescription = CRUDErrors.UpdateError,
      isbn = CRUDErrors.UpdateError,
      authors = CRUDErrors.UpdateError,
      genres = CRUDErrors.UpdateError,
      isHardcover = false /* Currently, not in use. */,
    } = data || {};

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
      /* @ts-ignore */
      bookToBeUpdated.isHardcover = isHardcover;
    });

    logWithTime("Succcessfully updated: ", bookToBeUpdated?.bookName);
  } catch (error) {
    logWithTime("[Realm | updateBook]");
    logWithTime(error);
  }
}

export function createBook(realm: Realm, data: TBookDataRef) {
  try {
    const {
      bookName = CRUDErrors.CreateError,
      bookImage = CRUDErrors.CreateError,
      bookDescription = CRUDErrors.CreateError,
      isbn = CRUDErrors.CreateError,
      authors = CRUDErrors.CreateError,
      genres = CRUDErrors.CreateError,
      isHardcover = false,
    } = data || {};
    const bookToBeCreated = Book.create(bookName, bookImage, bookDescription, isbn, authors, genres, isHardcover);
    realm.write(() => {
      realm.create("Book", bookToBeCreated);
      logWithTime("Succcessfully created: ", bookToBeCreated.bookName);
    });
  } catch (error) {
    logWithTime("[Realm | createBook]");
    logWithTime(error);
  }
}

/* User Operations */
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
