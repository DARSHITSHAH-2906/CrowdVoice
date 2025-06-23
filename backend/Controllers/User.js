const Users = require("../Models/User");
const { Posts, Comments } = require("../Models/Post")

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_AUTH_KEY);

const { generateJWTtoken } = require("../Service/auth");
const { getUser } = require("../Service/auth");

const AuthenticateUser = async (req, res) => {
    const { email, password } = req.body;
    const existinguser = await Users.findOne({ email: email, password: password });

    if (existinguser) {
        const token = generateJWTtoken(existinguser);

        res.status(200).json({
            message: "User Logged In Successfully",
            token: token,
            username: existinguser.name,
        })
    } else {
        res.status(400).json({ error: "Invalid Email or Password" });
    }
}

const GoogleAuthenticateUser = async (req, res) => {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_AUTH_KEY,
    });
    const payload = ticket.getPayload();

    const user = await Users.findOne({ email: payload.email });

    if (!user) {
        res.status(202).json({ error: "No user found" })
    }

    const jwttoken = generateJWTtoken(user);

    res.status(200).json({ message: "Logged in Successfull", token: jwttoken, name: user.name });
}

const SingUpUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const newuser = await Users.create({ name, email, password });
        const token = generateJWTtoken(newuser);
        res.status(200).json({ message: "User Sign up successfull", token: token });

    } catch (err) {
        res.status(400).json({ error: err });
    }
}

const GoogleSignUpUser = async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_AUTH_KEY,
        });
        const payload = ticket.getPayload();
        console.log(payload.email.split('@')[0])

        const newuser = await Users.create({ name: payload.email.split('@')[0], fullName: payload.name, email: payload.email, password: payload.sub });

        console.log(newuser);

        const jwttoken = generateJWTtoken(newuser);

        console.log(jwttoken)

        res.status(200).json({ message: "Account created succesfully", token: jwttoken, name: newuser.name });

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err });
    }
}

const FetchUserPosts = async (req, res) => {
    const token = req.query.token;
    try {
        const decoded = getUser(token);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const posts = await Posts.find({ postedBy: decoded._id, isArchieved: false }).populate("postedBy");
        console.log(posts)
        res.status(200).json({ posts });
    } catch (err) {
        res.status(202).json({ error: err })
    }
}

const Archivepost = async (req, res) => {
    const { id } = req.params;
    const updates = req.body
    try {
        const post = await Posts.findByIdAndUpdate(id, updates, { new: true });

        if (!post) {
            throw new Error("Error archieving post..");
        }
    } catch (err) {
        res.status(202).json({ error: err })
    }
}

const DeletePost = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    try {
        if(!user){
            throw new Error("USer not found");
        }

        const post = await Posts.findById(id);
        await Comments.deleteMany({ _id: { $in: post.comments } });
        await Users.findByIdAndUpdate(user._id , {$pull :{savedPosts : post._id}});
        await Posts.findByIdAndDelete(id);
        if (!post) {
            throw new Error("Error Deleting post");
        }

        res.status(200).json({ message: "Post Deleted Successfully" });

    } catch (err) {
        res.status(202).json({ error: err })
    }
}

const GetArchievedPosts = async (req, res) => {
    const token = req.query.token;
    try {
        const decoded = getUser(token);
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized" })
        }
        const posts = await Posts.find({ isArchieved: true, postedBy: decoded._id }).populate("postedBy");
        console.log(posts)
        res.status(200).json({ posts });
    } catch (err) {
        res.status(202).json({ error: err })
    }
}

const SavePost = async (req,res)=>{
    const {post_id} = req.body;
    let decoded = req.user;

    try{
        if(!decoded){
            throw new Error("User not found");
        }
        const user = await Users.findById(decoded._id);
        if(post_id in user.savedPosts){
            await Users.findByIdAndUpdate(user._id , {$pull : {savedPosts : post_id}});
            res.status(200).json({message:"Post Unsaved Successfully"});
        }else{
            await Users.findByIdAndUpdate(user._id , {$push : {savedPosts : post_id}});
            res.status(200).json({message:"Post Saved Successfully"});
        }

    }catch(error){
        console.log(error);
        res.status(202).json({error})
    }
}

const FetchSavedPosts = async (req,res)=>{
    const {token} = req.query;
    console.log(req.query)
    try{
        const decoded = getUser(token);
        console.log(decoded);
        const user = await Users.findById(decoded._id);
        const posts = await Posts.find({ _id: { $in: user.savedPosts } }).populate("postedBy");
        console.log(posts);
        res.status(200).json({ posts });
    }catch(error){
        console.log(error);
        res.status(202).json({error})
    }
}

module.exports = {
    AuthenticateUser,
    GoogleAuthenticateUser,
    SingUpUser,
    GoogleSignUpUser,
    FetchUserPosts,
    Archivepost,
    DeletePost,
    GetArchievedPosts,
    SavePost,
    FetchSavedPosts
}