import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URL);
    console.log('Mongoose is connected');
  } catch (error) {
    console.log('Mongoose connection failed:'); 
  }
};

export default connectDB;
