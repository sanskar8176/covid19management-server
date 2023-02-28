import mongoose from "mongoose";

// Defining Schema
const stateSchema = new mongoose.Schema({
  state: { type: String, required: true },
  totalcases: { type: Number, required: true },
  recovered: { type: Number, required: true },
  activecases: { type: Number, required: true },
  death: { type: Number, required: true },
  vaccinated: { type: Number, required: true },
  createdon: { type: Date, required: true },
  dateapproved: { type: Date },
  isapproved: { type: Boolean, default: false },
});

// Model
const StateModel = mongoose.model("state", stateSchema);

export default StateModel;
