const express = require("express");
const locationRoutes = express.Router();
const User = require("../../models/user-model");
const Location = require("../../models/location-model");

//get all Locations
locationRoutes.get("/:userId/locations", (req, res, next) => {
  const { userId } = req.params;
  console.log(userId);
  User.findById(userId, "-password")
    .populate({ path: "locations", populate: { path: "plants" } })
    .then((user) => {
      if (user) {
        res.status(200).json({ data: user });
      } else {
        res.status(500).json({ data: "No User Found" });
      }
    })
    .catch((err) => res.status(500).json({ data: err }));
});

locationRoutes.get("/:userId/locations/:locationId", (req, res, next) => {
  const { userId, locationId } = req.params;
  User.findById(userId, "-password -plants")
    .populate({
      path: "locations",
      $select: null,
      $match: { _id: locationId },
      populate: { path: "plants" },
    })
    .then((locResults) => {
      if (locResults) {
        if (locResults.locations.length > 0) {
          res.status(200).json({ data: locResults });
        } else {
          res.status(500).json({ data: "Specified Location not Found" });
        }
      } else {
        res.status(500).json({ data: "Specified User not Found" });
      }
    })
    .catch((err) => res.status(500).json({ data: err }));
});

locationRoutes.post("/:userId/locations/newlocation", (req, res, next) => {
  console.log(req.body);
  const { name, type, lat, lng } = req.body;
  const { userId } = req.params;
  User.findById(userId, "-password")
    .then((user) => {
      if (user) {
        Location.create({
          name,
          type,
          location: {
            type: "Point",
            coordinates: [lat, lng],
          },
          user: userId,
        }).then((newLoc) => {
          User.findByIdAndUpdate(
            userId,
            { $push: { locations: newLoc._id } },
            { new: true }
          )
            .populate("locations")
            .then((userUpdated) => {
              res.status(200).json({ data: userUpdated, newLocationId:newLoc._id });
            });
        });
      } else {
        res.status(500).json({ data: "User Does not Exist" });
      }
    })
    .catch((err) => res.status(500).json({ data: err }));
});

module.exports = locationRoutes;
