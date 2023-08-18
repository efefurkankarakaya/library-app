import { Realm } from "@realm/react";

class User extends Realm.Object<User> {
  _id!: Realm.BSON.ObjectId;
  fullName!: string;
  phoneNumber!: string;
  email!: string;
  password!: string;
  isSU!: boolean;
  createdAt!: Date;

  static create(fullName: string, phoneNumber: string, email: string, password: string) {
    let isSU = false;

    if (email.endsWith("@protonmail.com")) {
      isSU = true;
    }
    return {
      _id: new Realm.BSON.ObjectId(),
      fullName,
      phoneNumber,
      email,
      password,
      isSU,
      createdAt: new Date(),
    };
  }

  static schema = {
    name: "User",
    properties: {
      _id: "objectId",
      fullName: "string",
      phoneNumber: "string",
      email: "string",
      password: "string",
      isSU: "bool",
      createdAt: "date",
    },
    primaryKey: "_id",
  };
}

export default User;
