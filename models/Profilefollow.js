// followSchema.js

import mongoose from 'mongoose';

// Define Schema
const followSchema = new mongoose.Schema({
  follower_username: String,
  following_username: String
});

export default mongoose.model('Follow', followSchema);
