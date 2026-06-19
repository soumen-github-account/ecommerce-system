

import mongoose from "mongoose";

export const connectDb = async() => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI)
        console.log("URI:", process.env.MONGODB_URI);
        console.log(`MongoDB Connected Successfully.`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
}