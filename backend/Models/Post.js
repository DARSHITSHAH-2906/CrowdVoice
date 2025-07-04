const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
        trim: true,
    },
    commentedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    commentedOn: {
        type: String,
        default: new Date().toISOString(),
    }
} , {
    timestamps: true
});

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    images : [{
        type: String,
    }],
    videos:[{
        type:String
    }],
    attachments: [{
        type: String, // file URLs or file paths (e.g., PDFs, Docs)
        trim: true,
    }],
    tags: {
        type: String,
        trim: true,
    },
    likes: [{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    dislikes: [{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    category: {
        type: String,
        required: true,
    },
    PlaceOfIncident: {
        type: String,
    },
    urgency: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Low'
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments',
    }],
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        refPath : 'postedByModel'   //ref path can be used to refer to the model described in other field of the post model
    },
    postedByModel: {
        type : String,
        required : true,
        enum : ['User' , 'Community']
    },
    Postedon: {
        type: String,
        default: () => new Date().toISOString()
    },
    isArchieved: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        enum: ['general', 'community'],
        required: true
    }
}, {
    timestamps: true
});

const Posts = mongoose.model("Post", PostSchema);
const Comments = mongoose.model("comments" , CommentSchema);

module.exports = {Posts , Comments};