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
    const source = req.query.source
    let cond={}
    
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

        if(source == 'ptm'){
            cond = {film:film,show_date:condition,theatre_code:theatreCode,source:'ptm'}
        }
        else if(source=='bms'){
            cond = {film:film,show_date:condition,theatre_code:theatreCode,source:'bms'}
        }
        else{
            cond = {film:film,show_date:condition,theatre_code:theatreCode}
        }


        query = showData.find(cond,{'_id':0}).then(final=>{
        res.json(final)
        })
    })
    
})
router.post('/addshow',(req,res)=>{
    const data = req.body
    const id = req.body.show_id
    if(id)
    {

        // const showId = req.params.showid
        showData.findOneAndUpdate({show_id:id},data,{upsert:true,new:true},(err,doc)=>{
        if(err){
            res.send(err)
        }
        else{
            res.send(doc)
        }
    })

    }
    else{
        res.send("Error: Wrong Input")
    }
    

})

router.put('/addshows',(req,res)=>{
    const data = req.body
    console.log(data.show_id);
    res.json(data)
})

module.exports=router