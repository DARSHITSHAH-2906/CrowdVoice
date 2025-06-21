const mongoose = require("mongoose");

const CommunitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    bio: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    }],
    createdBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
    }
} , {
    timestamps : true
});

const Community = mongoose.model("Community" , CommunitySchema);

module.exports = Community;