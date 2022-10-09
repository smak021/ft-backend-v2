const mongoose = require('mongoose')
const url = process.env.MONGO_DB_URL

mongoose.connect(url)

// Define schemas

