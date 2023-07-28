import { Realm } from "@realm/react";

class User extends Realm.Object<User> {
  _id!: Realm.BSON.ObjectId;
  fullName!: string;
  phoneNumber!: string;
  email!: string;
  password!: string;
  createdAt!: Date; // TODO: Should I consider use moment() here?

  static create(fullName: string, phoneNumber: string, email: string, password: string) {
    return {
      _id: new Realm.BSON.ObjectId(),
      fullName: fullName,
      phoneNumber: phoneNumber,
      email: email,
      password: password,
      createdAt: new Date(), // TODO: Should I consider use moment() here?
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
      createdAt: "date", // TODO: Should I consider use moment() here?
    },
    primaryKey: "_id",
  };
}

export default User;
