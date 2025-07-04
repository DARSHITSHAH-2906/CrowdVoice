// models/Ngo.ts
const mongoose = require('mongoose');

const NgoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  mission: {
    type: String,
    required: true,
  },
  vision: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  causes: {
    type: [String], 
    required: true,
  },
  website: {
    type: String,
  },
  contactEmail: {
    type: String,
    required: true,
  },
  phone: String,
  location: String,
  logo: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  posts:[
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Post'
    }
  ],
  approved: {
    type: Boolean,
    default: false,
  },
}, {
    timestamps: true,
});

const Ngo = mongoose.model('Ngo', NgoSchema);

module.exports = {Ngo};
