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

router.post('/addlocation/:theatrecode',(req,res)=>{
    let filmid = req.params.theatrecode
    let data = req.body
    if(!req.body.theatre_code){
        res.status(400).send("invalid request")
    }
    else{
           filmData.findOneAndUpdate({theatre_code:theatrecode},data,{upsert:true,new:true},(err,doc)=>{
            if(err){
            res.send(err);}
            else{
                res.send(doc)
            }
           })
    }

})

module.exports=router