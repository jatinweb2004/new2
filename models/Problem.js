import mongoose from 'mongoose';

const fieldSchema = new mongoose.Schema({
  type: String,
  value: mongoose.Schema.Types.Mixed // Allow any type of value
});

const problemSchema = new mongoose.Schema({
  problemId: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  images: {
    type: String,
  },
  inputFields: [fieldSchema], // Array of field objects
  problemDetails: {
    problemName: String,
    category: String,
    tools: String,
    status: String,
  },
});

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;
