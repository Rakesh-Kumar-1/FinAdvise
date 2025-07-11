import mongoose from 'mongoose'

const payment = new mongoose.Schema({
    transcationId:{
        type:String,
        required:true
    },
    amount:{
        type:String,
        required:true
    },
    senderId:{
        type:String,
        required:true
    },
    recieverId:{
        type:String,
        required:true
    },
    payment_method:{
        type:String,
        default:"UPI"
    },
},{
    timestamps:true
});

export const paymentrecords = mongoose.model("PaymentRecords",payment)