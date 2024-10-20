import User from "../model/user.model.js";
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from "../utils/generateTokens.js";
import { io } from "../socket/socket.js";

export const signUp = async (req, res) => {
    try {
        const { fullname, username, password, confirmPassword, gender } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Password don't match" });
        }

        const user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // HASH PASSWORD HERE
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        //https://avatar-placeholder.iran.liara.run/

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;


        const newUser = new User({
            fullname,
            username,
            password: hashedPassword,
            confirmPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic
        });

        // console.log("newUser is created")

        if(newUser){
            // Generate JWT token here
            generateTokenAndSetCookie(newUser._id, res); 
            await newUser.save();
            
            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                username: newUser.username,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({ error: "Invalid user data"});
        }

        // console.log("newUser assigned new values")

    } catch (err) {
        // console.log("Error in signup controller", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    try{
        const { username, password } = req.body;
        const user = await User.findOne({username})
        const isPasswordCorrent = await bcrypt.compare(password, user?.password || "");

        if(!user || !isPasswordCorrent){
            return res.status(400).json({
                error: "Invalid username or password"
            })
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            profilePic: user.profilePic,
        })

    } catch(err){
        console.log("Error in login controller", err);
        res.status(500).json({
            error: "Interbal Server Error"
        })
    }
};

export const logout = async (req, res) => {
    try{
        const { userId, active } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Update user's lastSeen if they're active
        if (active) {
            await User.findByIdAndUpdate(userId, { lastSeen: Date.now() });
            io.emit("userStatusUpdate", {
                ID: userId,
                lastSeen: Date.now(),
            });
        }
        res.cookie("jwt","",{maxAge: 0});
        res.status(200).json({
            message: "Logged out successfully"
        });
    } catch(error){
        console.log("Error in login controller", error);
        res.status(500).json({
            error: "Interbal Server Error"
        })
    }
};
