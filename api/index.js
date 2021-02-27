const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const Auth = require('./routes/auth')

const app = express()
app.use(bodyParser.json())
app.use(cors())
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true, useUnifiedTopology:true})

app.use('/api/auth',Auth)

module.exports = app