require("dotenv").config({path : "../.env"});
const express = require("express");
const app = express();
const port = 3000
const cors = require("cors")
const cookieParser = require("cookie-parser")
const mongoose = require('mongoose');
const ACTIONS = require("./actions");
const server = require("http").createServer(app);
const path = require("path")
const Router = require("./routes/auth-route");
const io = require("socket.io")(server, {
    cors : {
        origin : "https://coderhouse-nw8l.onrender.com",
        methods : ["GET", "POST"],
    }
})



const _dirname = path.resolve()
app.use(cookieParser())
const corsOptions = {
    origin : ["https://coderhouse-nw8l.onrender.com"],
    methods : ["GET", "POST"],
    credentials : true
}

app.use(cors(corsOptions))
app.use("/storage", express.static("storage"))

const url = process.env.DB_URL

main().then(() => console.log("connected to db")).catch(err => console.log(err));

async function main() {
  await mongoose.connect(url, { 
    connectTimeoutMS: 30000, 
    socketTimeoutMS: 45000, 
    ssl: true,
    retryWrites: true});
}


app.use(express.json({limit : "8mb"}));
app.use("/", Router)




const socketUserMapping = {}


io.on("connection", (socket) => {
    console.log("new connection joined", socket.id);


    socket.on(ACTIONS.JOIN, ({roomId, user}) => {

        socketUserMapping[socket.id] = user;
        
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

        clients.forEach(clientId => {
            io.to(clientId).emit(ACTIONS.ADD_PEER, {
                peerId : socket.id,
                createOffer : false, 
                user
            })
            
            socket.emit(ACTIONS.ADD_PEER, {
                peerId : clientId,
                createOffer : true,
                user : socketUserMapping[clientId]
            })
        })


        socket.join(roomId)
    })

    //handle relay ice
    socket.on(ACTIONS.RELAY_ICE, ({peerId, icecandidate}) => {
        io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
            peerId : socket.id,
            icecandidate
        })
    })

    //handle relay sdp
    socket.on(ACTIONS.RELAY_SDP, ({peerId, sessionDescription}) => {
        io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
            peerId : socket.id,
            sessionDescription
        })
    })

    //handle mute, unmute
    socket.on(ACTIONS.MUTE, ({roomId, userId}) => {
 
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        clients.forEach(clientId => {
            io.to(clientId).emit(ACTIONS.MUTE, {
                peerId : socket.id,
                userId
            })
        })

    })

    socket.on(ACTIONS.UNMUTE, ({roomId, userId}) => {
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        clients.forEach(clientId => {
            io.to(clientId).emit(ACTIONS.UNMUTE, {
                peerId : socket.id,
                userId
            })
        })
    
    })

    //handle leave
    const leaveRoom = async({roomId}) => {
        const {rooms} = socket;

        Array.from(rooms).forEach(roomId => {
            
            const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
            
            clients.forEach(clientId => {
                io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
                    peerId : socket.id,
                    userId : socketUserMapping[socket.id]?.id ////////////////////////////////////////////////////////////////////////
                })
                
                socket.emit(ACTIONS.REMOVE_PEER, {
                    peerId : clientId,
                    userId : socketUserMapping[clientId]?.id ///////////////////////////////////////////////////////////////////////////////
                })
            })

            socket.leave(roomId)
        })

        delete socketUserMapping[socket.id]

    }

    socket.on(ACTIONS.LEAVE, leaveRoom)
    socket.on("disconnecting", leaveRoom)
})

app.use(express.static(path.join(_dirname, "frontend/dist")))

app.get("*", (_, res) => {
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"))
})

server.listen(port, () => {
    console.log(`app is listening on port ${port}`)
})
