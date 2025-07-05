const mongoose = require("mongoose")
require('dotenv').config()

const ConnectToDB = async ()=>{
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log("Database Connected Successfully"))
    .catch((err)=>console.log(err))
}

module.exports = ConnectToDB;