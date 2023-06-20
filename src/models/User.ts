import { Realm } from "@realm/react";

class User extends Realm.Object<User> {
  _id!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  password!: string;

  static schema = {
    name: "User",
    properties: {
      _id: "int",
      firstName: "string",
      lastName: "string",
      email: "string",
      password: "string",
    },
    primaryKey: "_id",
  };
}

export default User;
