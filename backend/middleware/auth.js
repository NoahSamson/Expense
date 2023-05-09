import jwt from "jsonwebtoken";
import ENV from "../config.js";

export const auth = (req, res, next)=> {
    // const token = req.header('x-access-token')
    console.log("at Auth");
    const token = req.headers.authorization.split(" ")[1];
    
    if(!token) {
        return res.status(406).json({err: "No Authorization token, authorization denied"});
    }

    const verified = jwt.verify(token, ENV.JWT_SECRET);

    if(!verified) return res.status(406).json({err: "Token verification failed, authorization denied"});
    
    req.id = verified.id;
    next(); 
}