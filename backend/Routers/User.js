const express = require("express");
const { AuthenticateUser , GoogleAuthenticateUser , SingUpUser , GoogleSignUpUser , FetchUserPosts, Archivepost , DeletePost , GetArchievedPosts , SavePost , FetchSavedPosts} = require("../Controllers/User");
const { VerifyUser } = require("../Middleware/Verifyuser");

const userrouter = express.Router();

userrouter.post("/auth" , AuthenticateUser)
userrouter.post("/auth/google" , GoogleAuthenticateUser)
userrouter.post("/signup" , SingUpUser);
userrouter.post("/signup/google" , GoogleSignUpUser);
userrouter.get("/posts", FetchUserPosts);
userrouter.get("/archieved-posts" , GetArchievedPosts)
userrouter.patch("/archivepost/:id" ,VerifyUser , Archivepost)
userrouter.delete("/deletepost/:id" , VerifyUser, DeletePost)
userrouter.patch("/save-post" , VerifyUser , SavePost)
userrouter.get("/saved-posts" ,VerifyUser, FetchSavedPosts)

module.exports = userrouter;