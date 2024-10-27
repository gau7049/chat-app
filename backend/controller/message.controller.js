import Conversation from "../model/conversation.model.js"
import Message from "../model/message.modal.js"
import { getReceiverSocketId } from "../socket/socket.js";
import { io } from "../socket/socket.js";
import User from "../model/user.model.js";
import mongoose from "mongoose";

export const sendMessage = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const {message} = req.body;
        const {id: receiverId}= req.params
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        }).session(session);

        if(!conversation){
            conversation = await Conversation.create(
                [{ participants: [senderId, receiverId] }],
                { session }
            );
        }

        const newMessage = new Message({
            senderId, 
            receiverId,
            message,
        });
        
        if(newMessage){
            conversation.messages.push(newMessage._id);
        }
         await Promise.all([
            conversation.save({ session }),
            newMessage.save({ session }),
        ]);
        // Update sender's lastSeen
        await User.findByIdAndUpdate(senderId, { lastSeen: Date.now() });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        // SOCKET IO FUNCTIONALITY WILL GO HERE
        const receiverSocketIds = getReceiverSocketId(receiverId);
        if(receiverSocketIds?.length > 0){
            // io.to(<socket_id>).emit() used to send events to specific client
            receiverSocketIds.forEach((socketId) => {
                io.to(socketId).emit("newMessage", { newMessage });
            });
        }

        res.status(201).json(newMessage);


    } catch (error) {
        await session.abortTransaction();
        console.error("Error in sendMessage controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        session.endSession();
    }
    console.log("Message sent");
}

export const getMessage = async (req, res) => {
    try{
        const { id:userToChatId } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId]},
        }).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

        if(!conversation) return res.status(200).json([]);

        const user = await User.findById(userToChatId).select("lastSeen");

        const messages = conversation.messages

        res.status(200).json({
            messages,
            lastSeen: user?.lastSeen ? user.lastSeen.toISOString() : null 
        });
        
    } catch(error){
        console.log("Error in sendingMessage controller: ", error)
        res.status(500).json({ error: "Internal server error"});
    }
}