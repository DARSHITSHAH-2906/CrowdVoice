const { Posts, Comments } = require("../Models/Post")
const Users = require("../Models/User")
const mongoose = require("mongoose")

// mongoose.set('debug', true);

const CreatePost = async (req, res) => {
    try {
        const images = req.files?.images || [];
        const videos = req.files?.videos || [];
        const user_id = req.user._id;

        const { title, description, category, placeOfIncident , urgency , tags } = req.body
        
        const imageUrl = images.map((image, ind) => `http://localhost:3000/uploads/image/${image.filename}`);
        const videoUrl = videos.map((video, ind) => `http://localhost:3000/uploads/video/${video.filename}`);

        console.log({
            title, description, category, placeOfIncident, user_id, imageUrl , videoUrl, urgency , tags
        });

        const newpost = await Posts.create({
            title: title,
            description: description,
            images : imageUrl,
            videos : videoUrl ,
            category: category,
            PlaceOfIncident: placeOfIncident,
            postedBy: user_id,
            urgency: urgency,
            tags: tags,
            postedByModel : 'User',
            type : "general"
        });

        res.status(200).json({ message: "Issue Posted Successfully" });

    } catch (err) {
        res.status(202).json({ error: err });
    }
}

const FetchPosts = async (req, res) => {
    try {
        const posts = await Posts.find({ isArchieved: false }).populate("postedBy");

        // console.log(posts);
        
        res.status(200).json({ posts });

    } catch (err) {
        res.status(202).json({ error: err });
    }
}

const AddComment = async (req, res) => {
    const { comment, post_id } = req.body;

    try {
        const newComment = await Comments.create({ comment: comment, commentedBy: req.user._id });

        const user = await Users.findById(req.user._id);
        const updatedPost = await Posts.findByIdAndUpdate(post_id, { $push: { comments: newComment._id } }, { new: true });

        // console.log({
        //     comment: comment, commentedOn: newComment.commentedOn, commentedBy: {
        //         _id: user._id,
        //         name: user.name
        //     }
        // });

        res.status(200).json({
            comment: comment, commentedOn: newComment.commentedOn, commentedBy: {
                _id: user._id,
                name: user.name
            }
        })
    } catch (err) {
        res.status(202).json({ error: err });
    }
}

const FetchComments = async (req, res) => {
    try {
        const post_id = req.params.id;

        const post = await Posts.findById(post_id)
            .populate({
                path: 'comments',
                populate: {
                    path: 'commentedBy',
                    select: 'name'  // Only fetch username if you don’t need the full user
                }
            });

        // console.log(post.comments);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({ comments: post.comments });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
};

const FetchPopularCategories = async (req,res)=>{
    try{
        const categories = await Posts.find().select("category");
        let popularcategory = {};
        categories.forEach(category => {
            if(category.category in popularcategory){
                popularcategory[category.category]+=1;
            }else{
                popularcategory[category.category]=1;
            }
        });
        // console.log(Object.entries(popularcategory));

        res.status(200).json({popularcategory : Object.entries(popularcategory)})
    }catch(err){
        console.log(err);
        res.status(202).json({error:err})
    }
}


module.exports = {
    CreatePost,
    FetchPosts,
    AddComment,
    FetchComments,
    FetchPopularCategories
}