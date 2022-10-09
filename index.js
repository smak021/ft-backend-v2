const express = require('express')
const app = express()

const port =process.env.PORT || 8000
app.use(express.urlencoded({extended:true}))
app.use(express.json())


app.get('/',(req,res)=>{
res.send("Testing")
})


app.listen(port,()=>{
    console.log("Server listening at 8000");
})