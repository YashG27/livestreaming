import { NextFunction, Request, Response } from "express";
import jwt, { decode } from "jsonwebtoken"
export const authMiddleware = (req : Request, res : Response, next : NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        res.status(400).json({
            message : "Unauthorized"
        })
        return
    }
    try {
        const decoded = jwt.verify(token, "JWT_SECRET") as {
            userId : string,
            isAdmin : boolean
        };
        if(!decoded.userId){
            res.status(400).json({
                message : "Unauthorized"
            })
            return
        }
        req.userId = decoded.userId;
        req.isAdmin = decoded.isAdmin;
        next()
    } catch(e : any){
        res.status(500).json({
            message : e.message
        })
        return
    }
}