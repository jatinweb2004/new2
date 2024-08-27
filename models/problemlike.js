import mongoose from 'mongoose';

const likesSchema = new mongoose.Schema({
    problemId: { type: String, required: true },
    userId: { type: String, required: true },
});

// Create a compound index on problemId and userId to enforce uniqueness
likesSchema.index({ problemId: 1, userId: 1 }, { unique: true });

const Likes = mongoose.model('Likes', likesSchema);

export default Likes;
