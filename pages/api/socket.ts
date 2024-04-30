import { Server } from "socket.io";
import { invoke_bedrock } from "./bedrock";

export default async function SocketHandler (req: any, res: any) {
    if (res && res.socket && res.socket.server.io) {
        console.log("Socket Already Setup");
        res.end();
        return;
    }

    const io = new Server(res.socket!.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
        socket.on("send-prompt", async (obj) => {
            console.log("send to bedrock");
            var response: any = await invoke_bedrock(obj);
            console.log("generated the image");
            const textDecoder = new TextDecoder('utf-8');
            const jsonString = textDecoder.decode(response.body.buffer);
        
            const parsedData = JSON.parse(jsonString);
            var imagebase64 = parsedData.artifacts[0].base64.trim();
            io.emit("receive-image", imagebase64);
            console.log("send the image to client");
        });
    });

    console.log("Setting Up Socket.io");
    res.end();
};

// export { SocketHandler as GET, SocketHandler as POST} 