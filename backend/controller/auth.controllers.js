import User from "../model/user.model.js";
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from "../utils/generateTokens.js";
import { io } from "../socket/socket.js";
import dns from 'dns';

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

    } catch (err) {
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
        res.status(500).json({
            error: "Internal Server Error"
        })
    }
};

export const logout = async (req, res) => {
    try{
        res.cookie("jwt","",{maxAge: 0});
        res.status(200).json({
            message: "Logged out successfully"
        });
    } catch(error){
        res.status(500).json({
            error: "Internal Server Error"
        })
    }
};

export const validateEmail = async (req, res) => {
  const { email } = req.body;
  const domain = email?.trim().toLowerCase().split("@")[1];

  dns.resolveMx(domain, (err, addresses) => {
    if (err || !addresses.length) {
      return res.json({ isValid: false });
    }
    res.json({ isValid: true });
  });
};
