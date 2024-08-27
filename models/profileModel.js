import mongoose from "mongoose";

const ProfileSchema = mongoose.Schema({
  imageUrl: {
    type: String,
  },
  userid: {
    type: String,
    required: true,
    unique: true,
   
  },
  name: {
    type: String
  },
  email: {
    type: String
  },
  age: {
    type: Number
  }
}, { timestamps: true });

export default mongoose.model('Profile', ProfileSchema);
