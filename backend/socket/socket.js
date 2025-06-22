import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "../model/user.model.js";
import Message from "../model/message.modal.js";
import mongoose from "mongoose";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:7049"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId] || [];
};

const userSocketMap = {}; // {userId: socketId}

export const activeConversations = new Map();

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId != "undefined") {
    if (!userSocketMap[userId]) {
      userSocketMap[userId] = [];
    }
    userSocketMap[userId].push(socket.id);
  }

  // io?.emit() is used to send events to all the connected clients
  io?.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("reset_unread_count", async ({ conversationId, userId }) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Step 1: Fetch the unread message IDs from the `unreadCount` field of the user for the specific conversation
      const user = await User.findOne({ _id: conversationId }).session(session);

      if (!user || !user.unreadCount || !user.unreadCount.get(userId)) {
        return; // No unread messages for this conversation, return early
      }

      const unreadMessageIds = user.unreadCount.get(userId); // Array of unread message IDs

      // Step 2: Update the status of all unread messages to "seen"
      await Message.updateMany(
        { _id: { $in: unreadMessageIds } },
        { $set: { status: "seen" } },
        { session }
      );

      io?.emit("status_change", unreadMessageIds);

      // Step 3: Clear the unreadCount array for this conversation and user
      await User.updateOne(
        { _id: conversationId },
        { $set: { [`unreadCount.${userId}`]: [] } },
        { session }
      );

      // Commit the transaction after both updates
      await session.commitTransaction();
    } catch (error) {
      // If an error occurs, abort the transaction
      console.error("Error in reset_unread_count:", error);

      // Only abort if the transaction hasn't been committed
      await session.abortTransaction();
    } finally {
      // End session
      session.endSession();
    }
  });

  socket.on("conversation_open", (conversationId) => {
    const userId = socket.id; // Assuming you have user authentication
    activeConversations.set(userId, conversationId);
  });

  // Handle typing event
  socket.on("typing", ({ recipientId, senderId }) => {
    const recipientSocket = userSocketMap[recipientId];
    if (recipientSocket) {
      io.to(recipientSocket).emit("typing", { senderId });
    }
  });
  
  // Handle stop_typing event
  socket.on("stop_typing", ({ recipientId, senderId }) => {
    const recipientSocket = userSocketMap[recipientId];
    if (recipientSocket) {
      io.to(recipientSocket).emit("stop_typing", { senderId });
    }
  });

  // socket.on() is used to listen to the events. can be used both on client and server side
  // Handle user disconnection
  socket.on("disconnect", async () => {
    if (userId) {
      userSocketMap[userId] = userSocketMap[userId].filter(
        (id) => id !== socket.id
      );
      if (userSocketMap[userId].length === 0) {
        delete userSocketMap[userId]; // No active connections for the user
      }
      io?.emit("getOnlineUsers", Object.keys(userSocketMap));
      io?.emit("userStatusUpdate", {
        // ID: Object.keys(userSocketMap),
        lastSeen: Date.now(),
        userID: userId,
      });
      // Update lastSeen timestamp in the database
      await User.findByIdAndUpdate(userId, { lastSeen: Date.now() });
      activeConversations.delete(socket.id);
    }
  });
});

export { app, io, server };
