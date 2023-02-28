import mongoose from "mongoose";

// Defining Schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  state: { type: String, trim: true },
  role: { type: String, required: true, trim: true },
});

// Model
const UserModel = mongoose.model("user", userSchema);

export default UserModel;
