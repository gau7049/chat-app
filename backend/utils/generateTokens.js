import jwt from "jsonwebtoken"

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "15d"
    });

    res.cookie("jwt",token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // MiliSeconds
        httpOnly: true, // prevent XSS attacks cross-size scripting attacks
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks 
        secure: true // only
    })
}

export default generateTokenAndSetCookie;