import User from "../model/user.model.js";
import Conversation from "../model/conversation.model.js";

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } })
      .select("-password")
      .lean(); //Find all users

    const userConversations = await Promise.all(
      filteredUsers.map(async (user) => {
        // Fetch the conversation between loggedInUserId and current user
        const conversation = await Conversation.findOne({
          participants: { $all: [loggedInUserId, user._id] },
        })
          .populate({
            path: "messages",
            options: { sort: { createdAt: -1 }, limit: 1 }, // Get the last message
          })
          .lean();

        // Include last message preview and last seen time in the response
        const lastMessage = conversation?.messages?.[0] || null;

        return {
          ...user,
          lastMessage: lastMessage ? lastMessage.message : null,
          lastMessageTime: lastMessage ? lastMessage.createdAt : null,
        };
      })
    );

     const sortedUserConversations = userConversations.sort((a, b) => {
      if (!a.lastMessageTime) return 1; // If no message, push user to the end
      if (!b.lastMessageTime) return -1;
      return new Date(b.lastMessageTime) - new Date(a.lastMessageTime); // Sort by most recent first
    });

    res.status(200).json(sortedUserConversations);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
