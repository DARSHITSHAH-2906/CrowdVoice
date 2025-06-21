const mongoose = require("mongoose")

const ConnectToDB = async ()=>{
    mongoose.connect("mongodb://127.0.0.1:27017/CrowdVoice")
    .then(()=>console.log("Database Connected Successfully"))
    .catch((err)=>console.log(err))
}

module.exports = ConnectToDB;