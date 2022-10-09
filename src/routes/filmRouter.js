const express = require('express')
const router = express.Router()
const {filmData}= require('../../config/connection')


router.get('/',(req,res)=>{
    res.send("In API EndPoint")
})



router.get('/getfilms',(req,res)=>{

    filmData.find({film_status:{$ne:"inactive"}}).sort({highlight:-1,release_date:-1,priority:-1}).then((data)=>{
        res.json(data)
    })
})

router.get('/getfilm/:filmid',(req,res)=>{
    let filmid = req.params.filmid
    filmData.findOne({film_id:filmid}).then((result)=>{
        res.json(result)
    })
})


router.post('/addfilm/:filmid',(req,res)=>{
    let filmid = req.params.filmid
    let data = req.body
    console.log(req.body.film_id);
    console.log(filmid);
    if(!req.body.film_id){
        res.status(400).send("invalid request")
    }
    else{
           filmData.findOneAndUpdate({film_id:filmid},data,{upsert:true,new:true},(err,doc)=>{
            if(err){
            res.send(err);}
            else{
                res.send(doc)
            }
           })
    }

})



module.exports = router