const Community = require("../Models/Community");
const { Posts } = require("../Models/Post");
const { getUser } = require("../Service/auth");

const CreateCommunity = async (req, res) => {
    const { name, bio } = req.body
    const coverImage = req.files.coverImage?.[0].filename;
    const profilePic = req.files.profilePic?.[0].filename;

    const coverImageUrl = `https://crowdvoice.onrender.com/uploads/image/${coverImage}`;
    const profilePicUrl = `https://crowdvoice.onrender.com/uploads/image/${profilePic}`;
    const createdBy = req.user._id;

    try {
        const newcommunity = await Community.create({ name: name, bio: bio, coverImage: coverImageUrl, profilePic: profilePicUrl, createdBy: createdBy });

        if (!newcommunity) {
            throw new Error("Error creating community");
        }

        const community = { ...newcommunity._doc, memberCount: newcommunity.members.length }

        res.status(200).json({ community });

    } catch (err) {
        console.log(err);
        res.status(202).json({ error: err })
    }
}

const FetchCommunityDetails = async (req, res) => {
    const id = req.params.id;

    try {
        const communitydetails = await Community.findById(id);
        const posts = await Posts.find({_id : {$in : communitydetails.posts}}).populate("postedBy");

        if (!communitydetails) {
            throw new Error("Community not found");
        }

        const communitydata = { ...communitydetails._doc, memberCount: communitydetails.members.length , posts : posts }

        res.status(200).json({ communitydata })
    } catch (err) {
        console.log(err);
        res.status(202).json({ error: err });
    }
}

const FetchAllCommunities = async (req, res) => {
    try {
        const communities = await Community.find();

        const communitydata = communities.map((community) => {
            return { _id: community._id, name: community.name, bio: community.bio, coverImage: community.coverImage, profilePic: community.profilePic, createdAt: community.createdAt, membersCount: community.members.length }
        });

        res.status(200).json({ communities: communitydata });

    } catch (err) {
        console.log(err);
        res.status(202).json({ error: err });
    }
}

const FetchUserCommunities = async (req, res) => {
    try {
        const decoded = req.user;

        if (!decoded) {
            res.status(401).json({ error: "UnAuthorized" });
        }

        const usercommunities = await Community.find({ createdBy: decoded._id });

        const usercommunitedata = usercommunities.map((community) => {
            return { _id: community._id, name: community.name, bio: community.bio, coverImage: community.coverImage, profilePic: community.profilePic, createdAt: community.createdAt, membersCount: community.members.length }
        });

        res.status(200).json({ usercommunitedata });

    } catch (err) {
        console.log(err);
        res.status(202).json({ error: err });
    }
}

const AddPost = async (req, res) => {
    const id = req.params.id;
    try{
        const images = req.files?.images || [];
        const videos = req.files?.videos || [];
        const { title, content, category, location , attachments , tags } = req.body
    
        const imageUrl = images.map((image, ind) => `https://crowdvoice.onrender.com/uploads/image/${image.filename}`);
        const videoUrl = videos.map((video, ind) => `https://crowdvoice.onrender.com/uploads/video/${video.filename}`);

        const post = await Posts.create({
            title: title,
            description : content,
            category: category,
            PlaceOfIncident : location,
            attachments: attachments.split(","),
            tags : tags,
            images: imageUrl,
            videos: videoUrl,
            postedBy: id,
            postedByModel : 'Community',
            type : "community"
        })

        await Community.findByIdAndUpdate(id , {$push :{posts : post._id}});

        res.status(200).json({message:"Post Created"})

    }catch(err){
        console.log(err);
        res.status(202).json({error:err});
    }
}

const AddMember = async (req,res)=>{
    const id = req.params.id;
    try{
        const decoded = req.user;
        await Community.findByIdAndUpdate(id , {$push : {members : decoded._id}});
        res.status(200).json({message:"Joined Community.."});
    }catch(err){
        console.log(err);
        res.status(202).json({error:err});
    }
}

const FetchPopularCommunities = async (req,res)=>{
    try{
        const communities = await Community.find().select(["name" , "profilePic" , "members"]);
        res.status(200).json({communities});
    }catch(error){
        console.log(error);
        res.status(202).json({error});
    }
}

module.exports = {
    CreateCommunity,
    FetchCommunityDetails,
    FetchAllCommunities,
    FetchUserCommunities,
    AddPost,
    AddMember,
    FetchPopularCommunities
}