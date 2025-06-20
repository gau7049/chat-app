import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname:{
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female"],
    },
    profilePic: {
        type: String,
        default: "",
    },
    lastSeen: {
        type: Date,
        default: null, // Initialize to the time of account creation
    },
    unreadCount: { 
        type: Map, // Track unread messages per conversation
        of: [String], // Number of unread messages per conversation
        default: {}, // Empty by default
    },
    // createdAt, updateAt => Member since <createdAt>
},{ timestamps: true })

const User = mongoose.model("User",userSchema);

export default User;