import Conversation from "../model/conversation.model.js"
import Message from "../model/message.modal.js"
import { getReceiverSocketId, activeConversations } from "../socket/socket.js";
import { io } from "../socket/socket.js";
import User from "../model/user.model.js";
import mongoose from "mongoose";

// export const sendMessage = async (req, res) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();
//     try{
//         const {message} = req.body;
//         const {id: receiverId}= req.params
//         const senderId = req.user._id;

//         let conversation = await Conversation.findOne({
//             participants: { $all: [senderId, receiverId] },
//         }).session(session);

//         if (!conversation) {
//             conversation = new Conversation({
//                 participants: [senderId, receiverId]
//             });
//             await conversation.save({ session });
//         }

//         const newMessage = new Message({
//             senderId, 
//             receiverId,
//             message,
//         });
        
//         if(newMessage){
//             if (!conversation.messages) {
//                 conversation.messages = []; // Initialize messages array if undefined
//             }
//             conversation.messages.push(newMessage._id);
//         }
//          await Promise.all([
//             conversation.save({ session }),
//             newMessage.save({ session }),
//         ]);
//         // Update sender's lastSeen
//         // await User.findByIdAndUpdate(senderId, { lastSeen: Date.now() });

//         // Commit the transaction
//         await session.commitTransaction();
//         session.endSession();

//         // SOCKET IO FUNCTIONALITY WILL GO HERE
//         const receiverSocketIds = getReceiverSocketId(receiverId);



//         if(receiverSocketIds?.length > 0){
//             // io.to(<socket_id>)?.emit() used to send events to specific client
//             receiverSocketIds.forEach((socketId) => {
//                 const activeConversation = activeConversations.get(socketId);
        
//             if (activeConversation !== senderId.toString()) {
//                 // Increment unread count only if the conversation is NOT open
//                 await User.updateOne(
//                         { _id: senderId },
//                         { $inc: { [`unreadCount.${receiverId}`]: 1 } }
//                     );
//                 } else {

//                 }
//                 io.to(socketId)?.emit("newMessage", { newMessage });
//             });
//         } else {
//               // Increment unread count only if the conversation is NOT open
//                 await User.updateOne(
//                         { _id: senderId },
//                         { $inc: { [`unreadCount.${receiverId}`]: 1 } }
//                     );
//         }

//         res.status(201).json(newMessage);


//     } catch (error) {
//         await session.abortTransaction();
//         console.error("Error in sendMessage controller: ", error);
//         res.status(500).json({ error: "Internal server error" });
//     } finally {
//         session.endSession();
//     }
// }

// export const sendMessage = async (req, res) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();
//     try {
//         const { message } = req.body;
//         const { id: receiverId } = req.params;
//         const senderId = req.user._id;

//         let conversation = await Conversation.findOne({
//             participants: { $all: [senderId, receiverId] },
//         }).session(session);

//         if (!conversation) {
//             conversation = new Conversation({
//                 participants: [senderId, receiverId],
//             });
//             await conversation.save({ session });
//         }

//         const newMessage = new Message({
//             senderId,
//             receiverId,
//             message,
//             status: "sent"
//         });

//         // Save the message first to get its _id
//         await newMessage.save({ session });

//         if (!conversation.messages) {
//             conversation.messages = []; // Initialize messages array if undefined
//         }
//         conversation.messages.push(newMessage._id);

//         await Promise.all([
//             conversation.save({ session }),
//         ]);

//         // Commit the transaction
//         await session.commitTransaction();
//         session.endSession();

//         // SOCKET IO FUNCTIONALITY WILL GO HERE
//         const receiverSocketIds = getReceiverSocketId(receiverId);

//         if (receiverSocketIds?.length > 0) {
//             // Use for...of instead of forEach to work properly with async/await
//             for (const socketId of receiverSocketIds) {
//                 const activeConversation = activeConversations.get(socketId);

//                 if (activeConversation !== senderId.toString()) {
//                     // Increment unread count only if the conversation is NOT open
//                     await User.updateOne(
//                         { _id: senderId },
//                         { $push: { [`unreadCount.${receiverId}`]: newMessage._id.toString() } }
//                     );
//                 }
//                 io.to(socketId)?.emit("newMessage", { newMessage });
//             }
//         } else {
//             // Increment unread count only if the conversation is NOT open
//             await User.updateOne(
//                 { _id: senderId },
//                 { $push: { [`unreadCount.${receiverId}`]: newMessage._id.toString() } }
//             );
//         }

//         res.status(201).json(newMessage);

//     } catch (error) {
//         await session.abortTransaction();
//         console.error("Error in sendMessage controller: ", error);
//         res.status(500).json({ error: "Internal server error" });
//     } finally {
//         session.endSession();
//     }
// }

export const sendMessage = async (req, res) => {
    const session = await mongoose.startSession();
    let transactionCommitted = false; // Track if the transaction was committed
    session.startTransaction();
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        }).session(session);

        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, receiverId],
            });
            await conversation.save({ session });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
            status: "sent"
        });

        // Save the message first to get its _id
        await newMessage.save({ session });

        if (!conversation.messages) {
            conversation.messages = []; // Initialize messages array if undefined
        }
        conversation.messages.push(newMessage._id);

        await Promise.all([
            conversation.save({ session }),
        ]);

        // Commit the transaction
        await session.commitTransaction();
        transactionCommitted = true; // Mark as committed
        session.endSession();

        // SOCKET IO FUNCTIONALITY WILL GO HERE
        const receiverSocketIds = getReceiverSocketId(receiverId);
        const senderIds = getReceiverSocketId(senderId);

        if (receiverSocketIds?.length > 0) {
            // Use for...of instead of forEach to work properly with async/await
            for (const socketId of receiverSocketIds) {
                const activeConversation = activeConversations.get(socketId);

                if (activeConversation !== senderId.toString()) {
                    // Increment unread count only if the conversation is NOT open
                    await User.updateOne(
                        { _id: senderId },
                        { $push: { [`unreadCount.${receiverId}`]: newMessage._id.toString() } }
                    );
                } else {
                    await Message.updateMany(
                        { _id: newMessage._id.toString() },
                        { $set: { status: "seen" } }
                      );
                      io.to(senderIds[0])?.emit("status_change", {
                        messageId: newMessage._id,
                        userId: senderId.toString()
                        });   
                }
                io.to(socketId)?.emit("newMessage", { newMessage });
            }
        } else {
            // Increment unread count only if the conversation is NOT open
            await User.updateOne(
                { _id: senderId },
                { $push: { [`unreadCount.${receiverId}`]: newMessage._id.toString() } }
            );
        }

        res.status(201).json(newMessage);

    } catch (error) {
        if (!transactionCommitted) {
            await session.abortTransaction();
        }
        console.error("Error in sendMessage controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        // Ensure that session is always ended after commit/abort
        session.endSession();
    }
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
        res.status(500).json({ error: "Internal server error"});
    }
}