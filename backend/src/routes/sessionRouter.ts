import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { prisma } from "../db/client";
import { createSessionSchema } from "../types/types";
import { empty } from "@prisma/client/runtime/library";
import { roomService } from "../roomService/client";
import { AccessToken, Room } from "livekit-server-sdk";
import { livekitAPiKey, livekitApiSecret } from "../config/config";

export const sessionRouter = Router();
sessionRouter.use(authMiddleware)

sessionRouter.post('/createSession', async (req, res) => {
    try{
        const valid = createSessionSchema.safeParse(req.body);
        if(!valid.success){
            res.status(404).json({
                message : "Wrong input types"
            })
            return
        }
        const {title, startTime, userId} = valid.data;
        const session = await prisma.session.create({
            data : {
                title,
                startTime,
                creatorId : userId
            }
        })
        res.status(200).json({
            sessionId : session.id
        })
    }catch(e : any){
        res.status(500).json({
            message : e.message
        })
        return
    }
}) 

sessionRouter.post('/start/:sessionId', async (req, res) => {
    if(!req.isAdmin === true){
        res.status(400).json({
            message : "Only admins are authorized to start"
        })
        return
    }
    const sessionId = req.params.sessionId;
    try {
        // See if we can get the user from the frontend and avoid this db call
        const user = await prisma.user.findUnique({
            where : {
                id : req.userId
            },
            select : {
                username : true
            }
        })
        const token = new AccessToken(livekitAPiKey, livekitApiSecret, {
            identity : req.userId,
            name :  user?.username,
            metadata : JSON.stringify({
                role : "Teacher",
            })
        })
        const videoGrant =  {
            roomCreate : true,
            roomJoin : true,
            roomList : true,
            roomRecord : true,
            roomAdmin : true,
            room : sessionId,
            recorder : true,
            canPublish : true,
            canSubscribe : true
        }
        token.addGrant(videoGrant)
        console.log(token)

        roomService.createRoom({
            name : sessionId,
            emptyTimeout : 10 * 60,
            departureTimeout : 10 * 60,
            maxParticipants : 20,
            metadata : JSON.stringify({
                creatorId : req.userId,
            })
        })
        console.log("Room created")
        await prisma.session.update({
            where : {
                id : sessionId
            },
            data : {
                status : "ONGOING"
            }
        })
        res.status(200).json({
            message : "Room created, ready to join",
            accessToken : token
        })
    } catch(e : any) {
        res.status(500).json({
            message : e.message
        })
    }
})

sessionRouter.post('/join/:sessionId', async(req, res) => {
    const sessionId = req.params.sessionId;
    try{
        const user = await prisma.user.findUnique({
            where : {
                id : req.userId
            },
            select : {
                username : true
            }
        })
        const token = new AccessToken(livekitAPiKey, livekitApiSecret, {
            identity : req.userId,
            name :  user?.username,
            metadata : JSON.stringify({
                role : "Student",
            })
        })
        token.addGrant({
            roomAdmin : false,
            roomCreate : false,
            room : sessionId,
            roomRecord : false,
            canPublish : false,
            canSubscribe : true
        })
        
        res.status(200).json({
            accessToken : token
        })
        return 
    } catch(e : any){
        res.status(500).json({
            message : e.message
        })
        return
    }
})  

sessionRouter.delete('/end/:sessionId', async (req, res) => {
    if(!req.isAdmin == true){
        res.status(400).json({
            message : "Only Admins are allowed"
        })
    }
    try{
        const sessionId = req.params.sessionId;
        roomService.deleteRoom(sessionId).then( () => {
            console.log("Room Deleted")
        })

        await prisma.session.update({
            where : {
                id : sessionId
            },
            data : {
                status : "FINISHED"
            }
        })
        res.status(200).json({
            message : "Session Ended"
        })
    }catch(e : any){
        res.status(500).json({
            message : e.message
        })
        return
    }
})

sessionRouter.delete('/:sessionId', async (req, res) => {
    const sessionId = req.params.sessionId
    try{
        await prisma.session.delete({
            where : {
                id : sessionId
            }
        })

        res.status(200).json({
            message : "Session Deleted successfully"
        })
    }catch(e : any){
        res.status(500).json({
            message : e.message
        })
        return
    }
})

sessionRouter.get('/sessions', async (req, res) => {

})

sessionRouter.put('/session', async (req, res) => {

})