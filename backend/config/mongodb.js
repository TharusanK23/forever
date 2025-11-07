import mongoose from "mongoose";

export const connectDB = async () => {

    mongoose.connection.on('connected', () => {
        console.log("<<<<< *********** " + process.env.APP_NAME + " MongoDB is Connected ********** >>>>>");    
    });
    
    mongoose.connection.on('error', (err) => {
        console.error("❌ Connection error:", "<<<<< *********** " + err.message + " ********** >>>>>");    
    });
    
    mongoose.connection.on('disconnected', () => {
        console.log("<<<<< *********** " + process.env.APP_NAME + " MongoDB is DisConnected ********** >>>>>");    
    });

    await mongoose.connect(process.env.MONGODB_URI).then(() => {
        console.log("<<<<< *********** " + process.env.APP_NAME + " MongoDB is Connected to DB ********** >>>>>");    
    }).catch((err) => {
        console.error("❌ Connection error:", err.message)
    });

    process.on('SIGINT', async () => {
        await mongoose.connection.close();
        process.exit(0);
    });
};

export default connectDB;