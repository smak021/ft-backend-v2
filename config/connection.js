const mongoose = require('mongoose')
const url = process.env.MONGO_DB_URL

mongoose.connect(url)

// Define schemas

const filmSchema= new mongoose.Schema({
    film_id:{
        type:String, 
        unique:true,
        required: true
    },
    film_name:String,
    cover_url:String,
    release_date:String,
    film_story:String,
    film_genre:String,
    film_censor:String,
    film_duration:String,
    full_name:String,
    film_status:String,
    cast_n_crew:{
       cast:{type:Array},
       crew:{type:Array}
    },
    tn_code:String,
    ptm_code:String,
    priority:Number,
    highlight:Number,
    language:String,
    other_land_code:Array
},{_id:false})

const showScema= new mongoose.Schema({
    show_id:String,
    show_time:String,
    ptm_count:{
        available:{type:String},
        booked:{type:String},
        total:{type:String},
    },
    show_date:String,
    theatre_code:String,
    film_id:String,
    last_modified:String
});

const mDataSchema=new mongoose.Schema({ 
    show_date:String,
    show_count:Number,
    category_name:String,
    price:Number,
    booked_seats:Number,
    available_seats:Number,
    total_seats:Number,
    film_id:String,
    theatre_code:String,
    theatre_location:String,
    theatre_name:String,
    last_modified:String
});

const trackSchema= new mongoose.Schema({
    track_id:String,
    track_location:String,
    isCurrentlyActive:String,
    loc_real_name:String,
    theatre_code:{
        type:String,
        unique:true
    },
    source:String,
    offset:{
        type:Array,
        of:Map
    }
})

const filmData = mongoose.model('film',filmSchema)
const showData = mongoose.model('show',showScema)
const mData = mongoose.model('mdata',mDataSchema)
const trackData = mongoose.model('track',trackSchema)

module.exports = {filmData,showData,mData,trackData}