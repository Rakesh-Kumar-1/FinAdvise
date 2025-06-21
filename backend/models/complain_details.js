import mongoose from 'mongoose'

const complainSchema = new mongoose.Schema({
    sender:{
        type:String,
        required:true
    },
    receiver:{
        type:String,
    },
    subject:{
        type:String,
        required:true
    },
    description:{
        type:String,
        // require:true
    },
    feedback:{
        type:String
    },
    status: {
    type: String,
    enum: ['Solved', 'Unsolved'],
    default: 'Unsolved', // default if not specified
  },
  role:{
    type:String,
    enum:['user','advisor'],
  }
},{
    timestamps:true
});

export const Complain = mongoose.model("Complain",complainSchema)