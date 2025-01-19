import z from "zod"
import { Request } from "express"
export const signupSchema = z.object({
    email : z.string().email(),
    password : z.string().min(8),
    username : z.string(),
    isAdmin : z.boolean()
})


export const signinSchema = z.object({
    email : z.string().email(),
    password : z.string().min(8)
})

declare global {
    namespace Express {
        interface Request {
            userId : string,
            isAdmin : boolean
        }
    }
}


