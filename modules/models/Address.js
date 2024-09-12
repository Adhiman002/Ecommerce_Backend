const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
  name: String,
  phone: String,
  userId: String,
  address: String,
  city: String,
  state: String,
  zip: String,
});

module.exports = mongoose.model("AddressDetails", AddressSchema);
