import User from '../model/user.model.js'

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password"); //Find all users

    res.status(200).json(filteredUsers);

    
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
