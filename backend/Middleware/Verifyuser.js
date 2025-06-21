const jwt = require('jsonwebtoken');
const { getUser } = require("../Service/auth")
const Users = require("../Models/User")
const Community = require("../Models/Community")

const VerifyUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(" ")[1];
        
        const user = getUser(token);
        console.log(user);
        
        if(!user){
            return res.status(202).json({error : "User not verified"});
        }

        req.user = user;
        next();
    }else{
        res.status(202).json({error : "User not verified"});
    }
}

const VerifyCommunityMember = async(req,res,next)=>{
    const id = req.params.id;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(" ")[1];
        
        const user = getUser(token);
        
        if(!user){
            return res.status(202).json({error : "User not verified"});
        }

        const community = await Community.findOne({_id : id , createdBy : user._id});

        if(!community){
            return res.status(202).json({error : "User not allowed to make post in this community"});
        }

        req.user = user;
        next();
    }else{
        res.status(202).json({error : "User not verified"});
    }
}

module.exports = { VerifyUser , VerifyCommunityMember }
