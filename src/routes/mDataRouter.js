const express = require('express')
const router = express.Router()
const {mData}= require('../../config/connection')



router.get('/getData/:filmid',(req,res)=>{
    
    const film = req.params.filmid


    pipeline1 = [
        {
    $lookup:{
        from: "tracks",       
        localField: "theatre_code",  
        foreignField: "theatre_code", 
        as: "theatre_location"         
    }
    },
    {   $unwind:"$theatre_location" },
        {
            $match: {film_id:film}
            },
           
        {
            $group:{_id:"$theatre_code",theatre_location:{$first:"$theatre_location.loc_real_name"},theatre_name:{$first:"$theatre_name"},show_count:{$sum:{$toInt:"$show_count"}},booked_seats:{$sum:{$toInt:"$booked_seats"}},total_seats:{$sum:{$toInt:"$total_seats"}},available_seats:{$sum:{$toInt:"$available_seats"}},price:{$sum:{$toDouble:"$price"}}}
            },
            {
                $project:{
                    _id:0,
                    theatre_code:"$_id",
                    theatre_location:1,
                    theatre_name:1,
                    show_count:1,
                    booked_seats:1,total_seats:1,
                    available_seats:1,
                    price:1
    
                }
            },
            {
                $sort:{price: -1}
            }
    ]

    pipeline2 = [
        {
            $match: {film_id:film}
            },
        {
            $group:{_id:"$show_date",film: { $first: "$film_id"},shows:{$sum:{$toInt:"$show_count"}},booked_seats:{$sum:{$toInt:"$booked_seats"}},total_seats:{$sum:{$toInt:"$total_seats"}},available_seats:{$sum:{$toInt:"$available_seats"}},total_amount:{$sum:{$toDouble:"$price"}},last_modified:{$first:"$last_modified"}}
            },
            {
                $project:{
                    _id: 0,
                    date:"$_id",
                    film: 1,
                    shows: 1,
                    booked_seats: 1,
                    total_seats: 1,
                    available_seats: 1,
                    total_amount: 1,
                    last_modified: 1
                }
            },
            {
                $sort:{date: 1}
            }
    ]
   mData.aggregate(pipeline1).exec((err,theatreData)=>{

    mData.aggregate(pipeline2).exec((err,dateData)=>{

        resultData = {"date":dateData,"theatre":theatreData}
        res.json(resultData)

    })

   })

   console.log();
})




router.get('/topfive',(req,res)=>{

    let today = new Date()
    let day = today.getDay()
    let offset = 0
    if(day<=4){
        offset = 3 + day 
    }
    else{
        offset = day - 4
    }
     today.setDate(today.getDate()-offset)
    const dateTwo = today
    let done = new Date()
    done.setDate(today.getDate()-6)
    const dateOne = done
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' });
    let mo = new Intl.DateTimeFormat('en', { month: '2-digit' });
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' });
    let fDateOne = ye.format(dateOne)+mo.format(dateOne)+da.format(dateOne)
    let fDateTwo = ye.format(dateTwo)+mo.format(dateTwo)+da.format(dateTwo)
    pip = topfivepipeline({})
    mData.aggregate(pip).exec((err,result)=>{
        pip2 = topfivepipeline({show_date:{$lte:fDateTwo,$gte:fDateOne}})
        mData.aggregate(pip2).exec((err,dateResult)=>{
            final = {"weekly":{"from":fDateOne,"to":fDateTwo,"data":dateResult},"overall":result}
            res.json(final)
        })
    })

})


router.put('/addData/:filmid/:theatreCode/:date',(req,res)=>{
    const film = req.params.filmid
    const theatreCode = req.params.theatreCode
    const date = req.params.date
    const data = req.body
    mData.findOneAndUpdate({film_id:film,theatre_code:theatreCode,show_date:date},data,{upsert:true,new:true},(err,doc)=>{
        if(err)
        {
            res.sendStatus(500)
        }
        else{
            res.sendStatus(200)
        }
    })
})


let topfivepipeline=(condition)=>{

   let pipeline = [ 
        {
        $lookup:{
                from: "films",       
                localField: "film_id",  
                foreignField: "film_id", 
                as: "film"         
            }
        },
          {   $unwind:"$film" },
        {
            $project:
            {
                'film._id':0,
                'film_film_status':0,
                'film.tn_code':0,
                'film.ptm_code':0,
                'film.priority':0,
                'highlight':0,
                'other_lang_code':0,
                'film.film_story':0
            }
        },
        {
            $match:condition
        },
        {
            $group:{
                _id:{film_id:"$film_id",show_date:"$show_date"},
                film:{$first:"$film"},
                total:{$sum:{$toDouble:"$price"}},
            }
        },
        {
            $sort:{_id:1}
        },
        {
            $group:{
                _id:"$_id.film_id",
                film:{$first:"$film"},
                total:{$sum:{$toDouble:"$total"}},
                rows:{$push:{date:"$_id.show_date",amount:"$total"}},
            }
        },
        {
            $project:{_id:0}
        },
        {
            $sort:{total: -1}
        },
        {
            $limit:5
        }
    ]

return pipeline
}

module.exports=router