const uploads = require("../Service/filehandler");
const { VerifyUser } = require("../Middleware/Verifyuser")
const { CreatePost, FetchPosts ,AddComment , FetchComments, FetchPopularCategories } = require("../Controllers/Post");

const express = require("express");

const postrouter = express.Router();

postrouter.post("/create" ,VerifyUser, uploads.fields([
    {name : "images", maxCount : 5},
    {name : "videos", maxCount : 5}
]) , CreatePost);
postrouter.get("/fetch" , FetchPosts);
postrouter.post("/add-comment" ,VerifyUser, AddComment)
postrouter.get("/comments/:id" , FetchComments)
postrouter.get("/popular-categories" , FetchPopularCategories)

module.exports = postrouter;

