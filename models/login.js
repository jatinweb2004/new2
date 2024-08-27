import mongoose from 'mongoose';

// Define the schema for the login data
const loginSchema = new mongoose.Schema({
  loginResponse: Object
});

// Create a Mongoose model based on the schema and export it
export default mongoose.model('LoginData', loginSchema);
