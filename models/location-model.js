const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    type:  {
      type: String,
      enum: {
        values: [
          "Indoor",
          "Outdoor",
        ],
        message:
          "Please chose from one of the following: Indoor, Outdoor",
      },
      required: true,
    },
    address:{
      type: String,
      required: [true, "Address is required."],
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    plants:[{ type: Schema.Types.ObjectId, ref: "Plant" }],
    user:{ type: Schema.Types.ObjectId, ref: "User" }
  },
  {
    timestamps: true,
  }
);

const Location = mongoose.model("Location", locationSchema);
module.exports = Location;
