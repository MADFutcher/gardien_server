const express    = require('express');
const plantRoutes = express.Router();
const User       = require('../../models/user-model');
const Location       = require('../../models/location-model');
const Plant          = require('../../models/plant-model')

//get all Locations
plantRoutes.post('/:userId/locations/:locationId/plants/new', (req,res,next)=>{
  const {userId, locationId} = req.params
  const {name, type, minTemp, maxTemp, ph} = req.body
  Plant.create({
        name,
        type,
        minTemp,
        maxTemp,
        ph,
        location:locationId,
        user:userId
      })
      .then(plant =>{
          Location.findByIdAndUpdate(locationId,{$push:{plants: plant._id}},{new:true})
                  .then(
                    User.findByIdAndUpdate(userId,{$push:{plants: plant._id}},{new:true})
                        .then(user=>{
                          res.status(200).json({data: user})
                        })
                  )
                  
      })
      .catch(err=>res.status(500).json({data:err}))
})

module.exports = plantRoutes;
