import {io} from "socket.io-client"

const socketInit = () => {
    const options = {
        "force new connection" : true,
        reconnectionAttempt : "Infinity",
        timeout : 10000,
        transports : ["websocket"],
    }
    return io("https://coderhouse-nw8l.onrender.com", options)
}

export default socketInit

