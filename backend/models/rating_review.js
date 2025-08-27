import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String
    }
}, {
    timestamps: true
});

export const Review = mongoose.model("Review", reviewSchema);
