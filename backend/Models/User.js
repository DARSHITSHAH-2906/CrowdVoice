const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name : {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  fullName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  profilePic: {
    type: String,
  },
  bio: {
    type: String,
    maxlength: 160
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: false
  },
  savedPosts:[{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Post'
  }],
  supportedPosts:[{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Post'
  }],

}, {
  timestamps: true // adds createdAt and updatedAt fields automatically
});

const Users = mongoose.model("User" , UserSchema);

module.exports = Users;