const mongoose = require("mongoose");

const SubsUsersSchema = require("./schemas");
// "mongodb://localhost:27017",

require("dotenv").config();
const connectDb = () => {
  try {
    mongoose.connect(
      process.env.URL_CONNECT,

      {
        useNewUrlParser: true,
      },
      (err, client) => {
        if (err) {
          console.log("Connection error", err);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
  return mongoose.connection;
};

const deletePostDate = (userId, deleteDay) => {
  connectDb();
  SubsUsersSchema.updateOne(
    { user_id: userId },
    {
      $set: {
        deleteDate: deleteDay(),
      },
    },
    (err, result) => {
      if (err) {
        console.log("Unable update user: ", err);
      }
    }
  );
  connectDb().on("error", console.log).on("disconnect", connectDb);
};
const checkUserDate = async () => {
  connectDb();
  const allUsers = await SubsUsersSchema.find({}).lean();

  connectDb().on("error", console.log).on("disconnect", connectDb);

  return allUsers;
};

module.exports = {
  deletePostDate,
  checkUserDate,
};
