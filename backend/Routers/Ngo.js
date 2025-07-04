const express = require('express');
const {VerifyUser} = require("../Middleware/Verifyuser");
const uploads = require("../Service/filehandler");
const {CreateNgo , FetchAllNgos } = require("../Controllers/Ngo");

const ngorouter = express.Router();

ngorouter.post("/create" , VerifyUser, uploads.single("logo") , CreateNgo);
ngorouter.get("/" , FetchAllNgos);

module.exports = ngorouter;