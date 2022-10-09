const express = require('express')
const router = express.Router()
const {trackData}= require('../../config/connection')




router.get('/',(req,res)=>{
    res.send("EndPOint")
})

router.get('/getlocations',(req,res)=>{
    trackData.find().then(data=>{
        res.send(data)
    })
})



module.exports=router