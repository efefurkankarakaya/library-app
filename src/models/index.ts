import { createRealmContext } from "@realm/react";
import User from "./User";

export const AppRealmContext = createRealmContext({
  path: "database.realm",
  deleteRealmIfMigrationNeeded: true, // TODO: Will be removed this line after creating the schema
  /**
   * Migration steps (if needed future again)
   * https://www.mongodb.com/docs/legacy/realm/javascript/latest/#migrations
   * https://stackoverflow.com/questions/55516453/error-migration-is-required-due-to-the-following-errors-in-react-native-realm
   */
  schema: [User],
});
