import express from "express"
import { AccessToken } from "livekit-server-sdk";
import { prisma } from "./db/client";
import cors from "cors"
import { authRouter } from "./routes/authRouter";   
import { sessionRouter } from "./routes/sessionRouter";
console.log(process.env)
const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));


app.get('/', (req, res) => {
    res.send("Server is Running")
})

app.use('api/v1/auth', authRouter)
app.use('api/v1/session', sessionRouter)
app.get('/getToken', async(req, res) => {
    const { roomName, participantName} = req.body;

    const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
        identity : participantName
    })
})
app.listen(3000, () => {
    console.log("Server is listening on port 3000")
})