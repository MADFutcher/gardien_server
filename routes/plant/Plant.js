const express    = require('express');
const plantRoutes = express.Router();
const User       = require('../../models/user-model');
const Location       = require('../../models/location-model');
const Plant          = require('../../models/plant-model')



plantRoutes.post('/:userId/plants/:plantId', (req,res,next)=>{
  const {userId, plantId} = req.params
  const {name, ph, minTemp, maxTemp, type} = req.body
  const updatedPlant = {
    name, ph, minTemp, maxTemp, type
  }
  User.findById(userId)
      .then(user=>{
        if(user){
          Plant.findByIdAndUpdate(plantId,updatedPlant,{new:true})
               .then((plant)=>{
                 res.status(200).json({data:plant})
               })
          }else{
            res.status(500).json({data:'User Doesnt Exist'})
          }
      })
      .catch(err=>res.send(500).json({data:err}))
})

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

plantRoutes.get('/:userId/plants/:plantId/delete', (req,res,next)=>{
  console.log('here')
  const {userId, plantId}=req.params
  User.findById(userId)
      .then(user=>{
        if(user){
          Plant.deleteOne({_id: plantId})
              .then(() => {Location.findOneAndUpdate({plants:plantId}, {$pull:{plants:plantId}})
                            .then(()=>{
                              User.findByIdAndUpdate(userId, {$pull:{plants:plantId}})
                                  .then(user => {res.status(200).json({data:user})})
                            })
              })     
        }else{
          res.status(500).json({data:'User Doesnt Exist'})
        }
      })
      .catch(err=>res.status(500).json({data:err}))
})



module.exports = plantRoutes;
