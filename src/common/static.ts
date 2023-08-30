import { Realm } from "@realm/react";
import { logWithTime } from "../utils/utils";

/* To create books, use a static, temporary id during the process. */
export const temporaryDataID = new Realm.BSON.ObjectId();
logWithTime("Temporary ID: ", temporaryDataID);

/**
(ChatGPT)
The value of temporaryDataID will not change every time you import the constant from the static.ts file, 
as long as the Realm.BSON.ObjectId is created only once when the static.ts file is initially imported or executed.

When you export and import a constant in JavaScript or TypeScript, you are essentially sharing the same value 
across different parts of your codebase. So, if you import temporaryDataID in multiple places, you will be referencing 
the same Realm.BSON.ObjectId instance.

In your case, since new Realm.BSON.ObjectId() is executed only once when the static.ts file is first imported or 
executed, subsequent imports of the temporaryDataID constant will refer to the same ObjectId instance 
that was created initially.

If you want a new ObjectId instance every time you import the constant, 
you would need to assign a function to temporaryDataID that generates a new ObjectId each time it's called:

  export const temporaryDataID = () => new Realm.BSON.ObjectId();

Then, whenever you import and call temporaryDataID(), it will create a new ObjectId instance.
 */
