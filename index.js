require('dotenv').config()
import axios from 'axios';
import axiosThrottle from 'axios-request-throttle';
const express = require('express')
const app = new express()
const filmRouter = require('./src/routes/filmRouter')
const trackRouter = require('./src/routes/trackRouter')
const showRouter = require('./src/routes/showRouter')
const mDataRouter = require('./src/routes/mDataRouter')

axiosThrottle.use(axios,{requestsPerSecond:5})
const port =process.env.PORT || 8000
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/api/films',filmRouter)
app.use('/api/shows',showRouter)
app.use('/api/data',mDataRouter)
app.use('/api/locations',trackRouter)


app.get('/',(req,res)=>{
res.send("Testing")
})


app.listen(port,()=>{
    console.log("Server listening at 8000");
})