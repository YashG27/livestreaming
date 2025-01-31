import { Router } from "express";
import { signinSchema, signupSchema } from "../types/types";
import bcrypt from "bcrypt"
import { prisma } from "../db/client";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config/config";
export const authRouter = Router();

authRouter.post("/signin", async(req, res) => {
    try{
        const valid = signinSchema.safeParse(req.body);
        if(!valid.success){
            res.status(400).json({
                message : "Wrong data format"
            })
            return
        }
        const {email, password} = valid.data;
        const user = await prisma.user.findUnique({
            where : {
                email
            }
        })
        if(!user){
            res.status(400).json({
                message : "User does not exist"
            })
            return
        }

        const check = await bcrypt.compare(password, user.password)
        if(!check){
            res.status(400).json({
                message : "Incorrect Password"
            })
            return
        }

        const token = jwt.sign({
            userId : user.id,
            isAdmin : user.isAdmin
        }, JWT_SECRET || "JWT_SECRET")

        res.status(200).json({
            message : `User ${user.id} signed in successfully`,
            token,
        })
    }catch(e : any){
        res.status(500).json({
            message : e.message
        })
    }
})


authRouter.post("/signup", async(req, res) => {
    try{
        const valid = signupSchema.safeParse(req.body);
        if(!valid.success){
            res.status(400).json({
                message : "Wrong data format"
            })
            return
        }
        const {email, password, username, isAdmin} = valid.data;

        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUser = await prisma.user.findUnique({
            where : {
                email
            }
        })
        if(existingUser){
            res.status(400).json({
                message : "User already exists"
            })
            return
        }

        const user = await prisma.user.create({
            data : {
                email,
                password : hashedPassword,
                username,
                isAdmin
            }
        })
        res.status(200).json({
            message : `User ${user.id} created`
        })
        return
    }catch(e : any){
        res.status(500).json({
            message : e.message
        })
    }
})