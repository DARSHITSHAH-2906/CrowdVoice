const uploads = require("../Service/filehandler");
const { VerifyUser } = require("../Middleware/Verifyuser")
const { CreatePost, FetchPosts ,AddComment , FetchComments, FetchPopularCategories, LikePost, DisLikePost, FetchCategoryPost } = require("../Controllers/Post");

const express = require("express");

const postrouter = express.Router();

postrouter.post("/create" ,VerifyUser, uploads.fields([
    {name : "images", maxCount : 5},
    {name : "videos", maxCount : 5}
]) , CreatePost);
postrouter.get("/" , FetchPosts);
postrouter.post("/add-comment" ,VerifyUser, AddComment)
postrouter.get("/comments/:id" , FetchComments)
postrouter.get("/popular-categories" , FetchPopularCategories)
postrouter.get("/fetch" , FetchCategoryPost)
postrouter.patch("/like-post/:id" , VerifyUser, LikePost)
postrouter.patch("/dislike-post/:id" , VerifyUser, DisLikePost)

module.exports = postrouter;

