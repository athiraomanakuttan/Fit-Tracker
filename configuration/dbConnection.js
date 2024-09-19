const mongoose = require('mongoose')

const connection = mongoose.connect('mongodb://localhost:27017/fit_track')
connection.then(()=>console.log("Connection succesfull"))
connection.catch((err)=> console.log("connection failde ",err))