import JWT_SECRET from "./config.js";
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({message: "Authorization header missing or malformed"});
    }

    const token = authHeader.split(" ")[1];

    try { 
        const decoded = jwt.verify(token, JWT_SECRET);

        if(decoded.userId) {
            req.userId = decoded.userId;
            return next();
        }
        else{
            return res.status(401).json({message:"Invalid token payload"});
        }

    } catch (err) {
        return res.status(403).json({message: "Invalid or expired token", error: err.message});
    }
};

export default authMiddleware;