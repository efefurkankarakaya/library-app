import { Realm } from "@realm/react";

class User extends Realm.Object<User> {
  _id!: Realm.BSON.ObjectId;
  firstName!: string;
  lastName!: string;
  email!: string;
  password!: string;
  createdAt!: Date;

  static create(firstName: string, lastName: string, email: string, password: string) {
    return {
      _id: new Realm.BSON.ObjectId(),
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      createdAt: new Date(),
    };
  }

  static schema = {
    name: "User",
    properties: {
      _id: "objectId",
      firstName: "string",
      lastName: "string",
      email: "string",
      password: "string",
      createdAt: "date",
    },
    primaryKey: "_id",
  };
}

export default User;
