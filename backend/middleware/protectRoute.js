import jwt from "jsonwebtoken"
import User from "../model/user.model.js";

const protectRoute = async (req, res, next) => {

    console.log("entering protectedRoute Components")

    try{

        const token = req.cookies.jwt; 

        console.log(token);

        if(!token){
            return res.status(401).json({ error: "Unauthorized - No Token Provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({error: "Unauthorized - Invalid Token"})
        }

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(404).json({error: "User not found"});
        }

        req.user = user;

        next(); // noe call sendMessage function after this function.

        console.log("Successfully passed protected Component")

    } catch (error) {
        console.log("Error in protected middleware: ", error)
        res.status(500).json({ error: "Internal server error"});
    }
}

export default protectRoute;