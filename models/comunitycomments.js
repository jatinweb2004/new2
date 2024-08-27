import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const queryCommentSchema = new Schema({
  queryId: {
    type: Schema.Types.ObjectId, // Assuming queryId references a MongoDB ObjectId
    required: true,
    ref: 'CommunityPost' // Reference to the related CommunityPost model
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String, // Assuming the image URL will be stored as a string
    trim: true
  },
  userid: {
    type: String, // Assuming userid references a MongoDB ObjectId
  required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

const QueryComment = model('QueryComment', queryCommentSchema);

export default QueryComment;
