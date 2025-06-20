import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["sent", "delivered", "seen"], // Restrict the status to specific values
            default: "sent", // Default status is "sent"
        }, 
    },
    {timestamps: true} // createdAt, updatedAt (helps to get time  of creation and last update)
)

const Message = mongoose.model("Message", messageSchema);

export default Message;