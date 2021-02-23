const express    = require('express');
const userRoutes = express.Router();
const User       = require('../../models/user-model');


//get User Details
userRoutes.get('/:_id', (req,res,next)=>{
  const {_id} = req.params
  User.findById(_id,"-password")
      .then(user =>{
        res.status(200).json({data:user})
      })
      .catch(err=>res.send(500).json({data:err}))
})


userRoutes.post("/:_id",(req,res,next)=>{
  const {locations,plants,username,email,picture} = req.body

})


module.exports = userRoutes;