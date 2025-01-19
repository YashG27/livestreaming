import axios from "axios";
import { Room, VideoPresets } from "livekit-client"
import { useEffect, useState } from "react"

export default function Meet(){

    const [token, setToken] = useState("");
    useEffect( () => {
        const url = "ws://localhost:7880";
        const accessToken = "hard-coded";
        setToken(accessToken)
        const initializeRoom = async() => {
            const room = new Room({
                adaptiveStream : true,
                dynacast : true,
                videoCaptureDefaults : {
                    resolution : VideoPresets.h540.resolution
                }
            })
            room.prepareConnection(url, token)
            await room.connect("ws://localhost:7880", token)
            console.log("Connnect to room", room.name);
            await room.localParticipant.enableCameraAndMicrophone();
        }
    }, [])
    return (
        <div>Meet</div>
    )
}