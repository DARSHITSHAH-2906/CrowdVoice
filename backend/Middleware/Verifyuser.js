const { getUser } = require("../Service/auth")
const Community = require("../Models/Community")

const VerifyUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(" ")[1];
        const user = getUser(token);
        if(!user){
            return res.status(401).json({error : "Unauthorized"});
        }
        req.user = user;
        next();
    }else{
        console.log("User not verified");
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
            return res.status(401).json({error : "Unauthorized"});
        }

        const community = await Community.findOne({_id : id });
        const member = community.members.includes(user._id);

        if(!member){
            return res.status(202).json({error : "User not allowed to make post in this community"});
        }

        req.user = user;
        next();
    }else{
        res.status(202).json({error : "User not verified"});
    }
}

module.exports = { VerifyUser , VerifyCommunityMember }
