import Conversation from "../model/conversation.model.js"
import Message from "../model/message.modal.js"
import { getReceiverSocketId } from "../socket/socket.js";
import { io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    console.log("Entering sendMessage component")
    try{
        const {message} = req.body;
        const {id: receiverId}= req.params
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        })

        if(!conversation){
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            })
        }

        const newMessage = new Message({
            senderId, 
            receiverId,
            message,
        });

        if(newMessage){
            conversation.messages.push(newMessage._id);
        }
        
        // await conversation.save();
        // await newMessage.save();
        
        // The above two lines can be replaced with the following line:
        // This will run in parallel
        await Promise.all([conversation.save(), newMessage.save()]);

        // SOCKET IO FUNCTIONALITY WILL GO HERE
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            // io.to(<socket_id>).emit() used to send events to specific client
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.status(201).json(newMessage);


    } catch (error) {
        console.log("Error in sendingMessage controller: ", error)
        res.status(500).json({ error: "Internal server error"});
    }
    console.log("message sent")
}

export const getMessage = async (req, res) => {
    try{
        const { id:userToChatId } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId]},
        }).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

        if(!conversation) return res.status(200).json([]);

        const messages = conversation.messages

        res.status(200).json(messages);
        
    } catch(error){
        console.log("Error in sendingMessage controller: ", error)
        res.status(500).json({ error: "Internal server error"});
    }
}