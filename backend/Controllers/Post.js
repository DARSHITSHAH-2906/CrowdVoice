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
        
        const imageUrl = images.map((image, ind) => `https://crowdvoice.onrender.com/uploads/image/${image.filename}`);
        const videoUrl = videos.map((video, ind) => `https://crowdvoice.onrender.com/uploads/video/${video.filename}`);

        await Posts.create({
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
        await Posts.findByIdAndUpdate(post_id, { $push: { comments: newComment._id } }, { new: true });

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

        res.status(200).json({popularcategory : Object.entries(popularcategory)})
    }catch(err){
        console.log(err);
        res.status(202).json({error:err})
    }
}

const LikePost = async (req, res) => {
    const post_id = req.params.id;
    const user_id = req.user._id;

    try {
        const post = await Posts.findById(post_id);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Check if the user has already liked the post
        const alreadyliked = post.likes.includes(user_id);

        if (alreadyliked) {
            // User has already liked the post, remove the dislike
            await Posts.findByIdAndUpdate(post_id, { $pull: { likes: user_id } }, { new: true });
            await Users.findByIdAndUpdate(user_id, { $pull: { supportedPosts: post_id } }, { new: true });
            return res.status(200).json({ message: "Post liked removed" });
        } else {
            // User has not disliked the post, add the dislike
            await Posts.findByIdAndUpdate(post_id, { $push: { likes: user_id } }, { new: true });
            await Users.findByIdAndUpdate(user_id, { $push: { supportedPosts: post_id } }, { new: true });
            return res.status(200).json({ message: "Post liked successfully" });
        }
    } catch (error) {
        console.error("Error liking post:", error);
        return res.status(500).json({ error: "Failed to like post" });
    }
}

const DisLikePost = async (req, res) => {
    const post_id = req.params.id;
    const user_id = req.user._id;

    try {
        const post = await Posts.findById(post_id);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Check if the user has already disliked the post
        const alreadyDisliked = post.dislikes.includes(user_id);

        if (alreadyDisliked) {
            // User has already disliked the post, remove the dislike
            await Posts.findByIdAndUpdate(post_id, { $pull: { dislikes: user_id } }, { new: true });
            return res.status(200).json({ message: "Post dislike removed" });
        } else {
            // User has not disliked the post, add the dislike
            await Posts.findByIdAndUpdate(post_id, { $push: { dislikes: user_id } }, { new: true });
            await Posts.findByIdAndUpdate(post_id, { $pull: { likes: user_id } }, { new: true });
            await Users.findByIdAndUpdate(user_id, { $pull: { supportedPosts : post_id } }, { new: true });
            return res.status(200).json({ message: "Post disliked successfully" });
        }
    } catch (error) {
        console.error("Error disliking post:", error);
        return res.status(500).json({ error: "Failed to dislike post" });
    }
}

const FetchCategoryPost = async (req, res) =>{
    const {category} = req.query;
    console.log(category)
    try{
        const posts = await Posts.find({category : category}).populate("postedBy");
        return res.status(200).json({posts});
    }catch(error){
        console.log(error);
        res.status(500).json({error})
    }
}


module.exports = {
    CreatePost,
    FetchPosts,
    AddComment,
    FetchComments,
    FetchPopularCategories,
    LikePost, 
    DisLikePost,
    FetchCategoryPost
}