const express    = require('express');
const externalRoutes = express.Router();
const axios = require('axios')


externalRoutes.post('/external/streetLatLng',(req,res,next)=>{
   console.log(req.body)
   const {address} = req.body
   console.log('Address:',address)
   axios.get('http://api.positionstack.com/v1/forward',
              {
                params:{
                  access_key:'e41479315c0953fc9b4a55f5f5a1622e',
                  query:address,
                  limit:1
                }
            })
            .then(results=>{
              console.log(results.data.data[0])
              const lat = results.data.data[0].latitude
              const lng = results.data.data[0].longitude
              res.status(200).json({lat,lng})
            })
            .catch(err=>{res.status(500).json({data:err})})

    
})

externalRoutes.post('/external/latlngStreet',(req,res,next)=>{
  const {lat, lng} = req.body
  console.log('lat, lng:',lat, lng)
  const latlng = `${lat},${lng}`
  axios.get('http://api.positionstack.com/v1/reverse',
            {
              params:{
                access_key:'e41479315c0953fc9b4a55f5f5a1622e',
                query:latlng,
                limit:1
              }
          })
          .then(results=>{
            res.status(200).json({data:results})
          })
          .catch(err=>{res.status(500).json({data:err})})
})





 
module.exports = externalRoutes;