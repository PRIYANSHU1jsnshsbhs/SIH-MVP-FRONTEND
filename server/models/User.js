const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  personal_info: {
    first_name: String,
    last_name: String,
    dob: String,
    gender: String,
    nationality: String,
    contact: {
      email: String,
      phone_number: String,
    },
  },
  documents: {
    passport: {
      number: String,
      issue_date: String,
      expiry_date: String,
      issuing_country: String,
    },
    visa: {
      type: String,
      expiry_date: String,
    },
  },
  addresses: {
    permanent: {
      street: String,
      city: String,
      state: String,
      postal_code: String,
      country: String,
    },
    in_india: {
      street: String,
      city: String,
      state: String,
      postal_code: String,
    },
  },
  emergency_contact: {
    name: String,
    relationship: String,
    phone_number: String,
  },
  travel_details: {
    purpose_of_visit: String,
    arrival_date: String,
    departure_date: String,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
