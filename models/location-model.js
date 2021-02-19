const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSchema = new Schema(
  {
    Name: {
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
    plants:[{ type: Schema.Types.ObjectId, ref: "Plant" }],
    user:{ type: Schema.Types.ObjectId, ref: "User" }
  },
  {
    timestamps: true,
  }
);

const Location = mongoose.model("Location", locationSchema);
module.exports = Location;
