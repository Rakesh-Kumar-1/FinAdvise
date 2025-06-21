import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    image: {
    type: String,
    default:null
    },
    follows: {
        type: [String],
        default: []
    }
},{
    timestamps:true
});

export const User = mongoose.model("user",userSchema)