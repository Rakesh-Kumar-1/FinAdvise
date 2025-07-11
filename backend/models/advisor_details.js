import mongoose from 'mongoose';
// Main advisor schema
const advisorDetailsSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password:{
    type:String,
    required: true,
    default: 'manager0000'
  },
  phone: {
    type: String,
    required: true,
  },
  linkedIn: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  client: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive', 
  },
  permission: {
    type: String,
    enum: ['allow', 'notallow'],
    default: 'notallow', 
  },
  images: {
    type: [String],
    required:true,
  },
  schedule: {
    monday: { type: [String], default: [] },
    tuesday: { type: [String], default: [] },
    wednesday: { type: [String], default: [] },
    thursday: { type: [String], default: [] },
    friday: { type: [String], default: [] },
    saturday: { type: [String], default: [] },
    sunday: { type: [String], default: [] },
  }
  
}, {
  timestamps: true
});

// Export model
export const Advisor = mongoose.model("Advisor", advisorDetailsSchema);
