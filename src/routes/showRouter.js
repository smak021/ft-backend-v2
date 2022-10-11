const express = require('express')
const router = express.Router()
const {showData,filmData}= require('../../config/connection')

router.get('/',(req,res)=>{
    res.send("S End Point")
})

router.get('/getShows',(req,res)=>{
    const theatreCode = req.query.theatreCode
    const date = req.query.date
    const film =req.query.filmId
    const yr =date.slice(0,4)
    const month = date.slice(4,6)
    const day = date.slice(6,8)
    const today = new Date(yr,month-1,day)
    filmData.findOne({film_id:film},{_id:0,release_date:1}).then((data)=>{
        const releaseDate = data.release_date
        const diffTime =new Date(releaseDate) - today;
        const diffDays =Math.round(diffTime / (1000 * 60 * 60 * 24)); 
        let condition=date
        if(diffDays>0)
        {
            condition = {$gte:date}
        }
        else{
            condition = date
        }
        query = showData.find({film_id:film,show_date:condition,theatre_code:theatreCode},{'_id':0}).then(final=>{
        res.json(final)
        })
    })
    
})
router.post('/addshow/:showid',(req,res)=>{
    const data = req.body
    const showId = req.params.showid
    showData.findOneAndUpdate({show_id:showId},data,{upsert:true,new:true},(err,doc)=>{
        if(err){
            res.send(err)
        }
        else{
            res.send(doc)
        }
    })

})

// router.put('/addshows',(req,res)=>{

// })

module.exports=router