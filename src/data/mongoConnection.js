import mongoose from 'mongoose';

export const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.log("Error to connect MongoDB", error.message)
        process.exit(1)        
    }
}