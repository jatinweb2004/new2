import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const commentSchema = new Schema({
  problemId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  image: {
    type: String // Assuming the image URL will be stored as a string
  },
  userid: {
    type: String, // Assuming the userid will be stored as a string
    
  },
  content: {
    type: String,
    required: true
  }
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

const Comment = model('Comment', commentSchema);

export default Comment;
