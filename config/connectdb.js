import mongoose from "mongoose";

const connectDB = async (username, password) => {
  const DATABASE_URL = `mongodb+srv://${username}:${password}@cluster0.ldlos6m.mongodb.net/?retryWrites=true&w=majority`;
  try {
    const DB_OPTIONS = {
      dbName: "okcl",
    };
    // (node:6060) [MONGOOSE] DeprecationWarning: Mongoose: the `strictQuery` option will be switched back to `false` by default in Mongoose 7. Use `mongoose.set('strictQuery', false);` if you want to prepare for this change. Or use `mongoose.set('strictQuery', true);` to suppress this warning.
    mongoose.set("strictQuery", true);
    await mongoose.connect(DATABASE_URL, DB_OPTIONS);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Error while connecting with database", error.message);
  }
};

export default connectDB;
