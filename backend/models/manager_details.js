import mongoose from 'mongoose';

// Manager details schema
const managerSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  linkedIn: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "manager"
  }
  // images: {
  //   type: String,
  //   trim: true
  // }
}, {
  timestamps: true
});

// Export model
export const Manager = mongoose.model("Manager", managerSchema);
