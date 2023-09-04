class Loan extends Realm.Object<Loan> {
  _id!: Realm.BSON.ObjectId;
  bookId!: Realm.BSON.ObjectId;
  userId!: Realm.BSON.ObjectId;
  createdAt!: Date; /* TODO: Should be loanedAt!: Date */

  static create = (bookId: Realm.BSON.ObjectId, userId: Realm.BSON.ObjectId) => {
    return {
      _id: new Realm.BSON.ObjectId(),
      bookId,
      userId,
      createdAt: new Date(),
    };
  };

  static schema = {
    name: "Loan",
    properties: {
      _id: "objectId",
      bookId: "objectId",
      userId: "objectId",
      createdAt: "date",
    },
    primaryKey: "_id",
  };
}

export default Loan;
