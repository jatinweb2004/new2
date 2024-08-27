import mongoose from 'mongoose';

// Define the schema
const CommunityPostSchema = new mongoose.Schema({
  authorEmail: {
    type: String,
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  autherimage: {
    type: String,
    required: true,
    
  },
  question: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  postType: {
    type: String,
    required: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the model
const CommunityPosts = mongoose.model('CommunityPost', CommunityPostSchema);

export default CommunityPosts;
