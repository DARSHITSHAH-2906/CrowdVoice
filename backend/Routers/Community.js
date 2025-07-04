const express = require("express");

const { CreateCommunity , FetchCommunityDetails, FetchAllCommunities, FetchUserCommunities, AddPost, AddMember, FetchPopularCommunities} = require("../Controllers/Community");
const { VerifyUser, VerifyCommunityMember } = require("../Middleware/Verifyuser");
const uploads = require("../Service/filehandler");

const communityrouter = express.Router();

communityrouter.post("/create" , VerifyUser, uploads.fields([
    {name : "profilePic"},
    {name:"coverImage"}
]), CreateCommunity);
communityrouter.get("/fetchdetails/:id" , FetchCommunityDetails)
communityrouter.get("/communities" , FetchAllCommunities)
communityrouter.get("/my-community" ,VerifyUser, FetchUserCommunities)
communityrouter.post("/add-post/:id", VerifyCommunityMember ,uploads.fields([
    {name : "images" , maxCount : 5},
    {name : "videos", maxCount : 5}
]), AddPost)
communityrouter.patch("/add-member/:id" ,VerifyUser, AddMember)
communityrouter.get("/popular-communities" , FetchPopularCommunities)

module.exports = communityrouter
