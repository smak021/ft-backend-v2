const express = require('express')
const router = express.Router()
const {trackData}= require('../../config/connection')




router.get('/',(req,res)=>{
    res.send("EndPOint")
})

router.get('/getlocations',(req,res)=>{
    trackData.find().then(data=>{
        res.json(data)
    })
})

router.get('/getlocations/:id',(req,res)=>{
    const channel = req.params.id
    const type = req.query.type
    if(type==0)
    {
        const pipeline = [
            {
                $match:
                    {source:channel}
                
            },
            {
                $group:
                {
                    _id:"$track_location",
                    theatre_codes:{
                    $addToSet:"$theatre_code"
                    },
                    loc_real_name:{$first:"$loc_real_name"}
                }
            },
            {
                $project:{
                    _id:0,
                    location:"$_id",
                    theatre_codes:1,
                    loc_real_name:1
                }
            },
            {
            $sort:{location:1}
            }
        ]
        trackData.aggregate(pipeline).exec((err,result)=>{
            res.json(result)
        })
        // trackData.find({source:channel},{_id:0,loc_real_name:1}).distinct("loc_real_name").then(result=>{
        //     res.json(result)
        // })
    }
    else if(type==1){
        trackData.find({source:channel},{_id:0,track_location:1}).distinct("track_location").then(result=>{
            res.json(result)
        })
    }
    else{
        trackData.find({source:channel}).then(result=>{
            res.json(result)
        })
    }
   
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