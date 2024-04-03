import mongoose from "mongoose";

const connectToMongoDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Connected to Mongo")

    } catch(err){
        console.log("Error to connecting MongoDB",err)
    }
}

export default connectToMongoDB