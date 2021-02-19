const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "username is required."],
      unique: true,
    },
    password: { type: String, required: [true, "password is required."] },
    email: {
      type: String,
      required: [true, "Email is required."],
      // this match will disqualify all the emails with accidental empty spaces, missing dots in front of (.)com and the ones with no domain at all
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    picture: { type: String },
    locations:[{ type: Schema.Types.ObjectId, ref: "Location" }],
    plants:[{ type: Schema.Types.ObjectId, ref: "Plant" }]
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
