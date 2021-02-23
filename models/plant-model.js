const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const plantSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    type:  {
      type: String,
      enum: {
        values: [
          "Vegetable",
          "Flower",
          "Tree",
          "Shrub",
          "Fruit",
          "Nuts",
        ],
        message:
          "Please chose from one of the following: Vegetable, Flower, Tree, Shrub, Fruit, Nut",
      },
      required: true,
    },
    sow: {type: Date},
    harvest: {type: Date},
    minTemp:{type: Number},
    maxTemp:{type: Number},
    ph:{type:Number},
    soilType: {
      type: String,
      enum: {
        values: [
          "Acidic",
          "Alkaline",
          "Neutral"
        ],
        message:
          "Please chose from one of the following: Acidic, Alkaline, Neutral",
      },
    },
    picture: { type: String },
    user:{ type: Schema.Types.ObjectId, ref: "User" },
    location:{ type: Schema.Types.ObjectId, ref: "Location" }
  },
  {
    timestamps: true,
  }
);

const Plant = mongoose.model("Plant", plantSchema);
module.exports = Plant;
