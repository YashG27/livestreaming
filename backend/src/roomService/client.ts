import { RoomServiceClient } from "livekit-server-sdk"

const { LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET} = process.env;
if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET){
    throw new Error("Missing enviornment variables for LIVEKIT")
}
export const roomService = new RoomServiceClient(LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET )