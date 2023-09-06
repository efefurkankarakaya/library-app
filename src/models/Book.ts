import { Realm } from "@realm/react";
import { ImagePickerAsset } from "expo-image-picker";

class Book extends Realm.Object<Book> {
  _id!: Realm.BSON.ObjectId;
  bookName!: string;
  bookImage!: string;
  bookDescription?: string;
  isbn!: string;
  authors!: string; // Or Realm.List<string> ---> https://www.mongodb.com/docs/realm/sdk/react-native/model-data/define-a-realm-object-model/
  genres!: string;
  isHardcover!: boolean;
  createdAt!: Date;

  static create = (
    bookName: string,
    bookImage: ImagePickerAsset["base64"],
    bookDescription: string | null,
    isbn: string,
    authors: string,
    genres: string,
    isHardcover: boolean
  ) => {
    return {
      _id: new Realm.BSON.ObjectId(),
      bookName,
      bookImage,
      bookDescription,
      isbn,
      authors,
      genres,
      isHardcover,
      createdAt: new Date(),
    };
  };

  static schema = {
    name: "Book",
    properties: {
      _id: "objectId",
      bookName: "string",
      bookImage: "string?",
      bookDescription: "string?",
      isbn: "string",
      authors: "string",
      genres: "string",
      createdAt: "date",
      isHardcover: "bool",
    },
    primaryKey: "_id",
  };
}

export default Book;
