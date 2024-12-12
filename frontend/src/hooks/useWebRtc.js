import React, {useCallback, useEffect, useRef} from 'react'
import useStateWithCallback from './useStateWithCallback'
import socketInit from "../socket"
import { ACTIONS } from '../actions'
import freeice from "freeice"

const useWebRtc = (roomId, user) => {

    const [clients, setClients] = useStateWithCallback([])
    const audioElements = useRef({})
    const connections = useRef({})
    const localMediaStream = useRef(null);
    const socket = useRef(null);
    const clientsRef = useRef([])

    const addNewClient = useCallback((newClient, cb) => {
        const lookingFor = clients.find((client) => client.id === newClient.id)
        if(lookingFor === undefined){
            setClients((existingClients) => [...existingClients, newClient], cb)
        }
    }, [clients, setClients])



    useEffect(() => {
        clientsRef.current = clients;
    }, [clients])

    useEffect(() => {

        const initChat = async () => {

            socket.current = socketInit();

            await captureMedia();
            addNewClient({...user, muted : true}, () => {
                const localElement = audioElements.current[user.id]
                if(localElement){
                    localElement.volume = 0;
                    localElement.srcObject = localMediaStream.current;
                }

                //socket emit join socket io
                socket.current.emit(ACTIONS.JOIN, {roomId, user})


            })

            socket.current.on(ACTIONS.ADD_PEER, handleNewPeer)
            socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer)
            socket.current.on(ACTIONS.ICE_CANDIDATE, handleIceCandidate)
            socket.current.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSdp)
            socket.current.on(ACTIONS.MUTE, ({peerId, userId}) => {
                setMute({mute : true, userId});
            })
            socket.current.on(ACTIONS.UNMUTE, ({peerId, userId}) => {
                setMute({mute : false, userId});
            })

            socket.current.emit(ACTIONS.JOIN, {
                roomId,
                user,
            });

            async function captureMedia() {
                try {
                    console.log("Capturing media...");
                    // Start capturing local audio stream
                    localMediaStream.current = await navigator.mediaDevices.getUserMedia({
                        audio: true,
                    });
                } catch (error) {
                    console.error('Error capturing media:', error);
                }
            }

            async function handleNewPeer({peerId, createOffer, user: remoteUser }) {
                //if already connected give warning
                if(peerId in connections.current){
                    return console.warn(`you are already connected with ${peerId} (${user.name})`)
                }
    
                connections.current[peerId] = new RTCPeerConnection({
                    iceServers : freeice()
                })
    
                //handle new ice candidate
                connections.current[peerId].onicecandidate = (event) => {
                    socket.current.emit(ACTIONS.RELAY_ICE, {
                        peerId,
                        icecandidate : event.candidate
                    })
                }
    
                //handle on track on this connection
                connections.current[peerId].ontrack = ({
                    streams : [remoteStream]
                }) => {
                    addNewClient({...remoteUser, muted : true}, () => {
                        if(audioElements.current[remoteUser.id]){
                            audioElements.current[remoteUser.id].srcObject = remoteStream
                        }else{
                            let settled = false;
                            const interval = setInterval(() => {
                                if(audioElements.current[remoteUser.id]){
                                    audioElements.current[remoteUser.id].srcObject = remoteStream
                                    settled = true;
                                }
                                if(settled){
                                    clearInterval(interval);
                                }
                            }, 300)
                        }
                    })
                }
    
    
                //add local track to rmeote connection
                localMediaStream.current.getTracks().forEach(track => {
                    connections.current[peerId].addTrack(track, localMediaStream.current)
                })
    
                //create offer
                if(createOffer){
                    const offer = await connections.current[peerId].createOffer();
    
                    await connections.current[peerId].setLocalDescription(offer)
    
                    //send offer to another client
                    socket.current.emit(ACTIONS.RELAY_SDP, {
                        peerId,
                        sessionDescription : offer
                    })
    
                }
    
            }

            async function handleRemovePeer({ peerId, userId }) {
                if(connections.current[peerId]){
                    connections.current[peerId].close()
                }
                delete connections.current[peerId]
                delete audioElements.current[peerId]
                setClients(list => list.filter(client => client.id !== userId))
            }

            async function handleIceCandidate({ peerId, icecandidate }){
                if(icecandidate){
                    connections.current[peerId].addIceCandidate(icecandidate)
                }
            }

            async function handleRemoteSdp({
                peerId,
                sessionDescription: remoteSessionDescription,
            }){
                connections.current[peerId].setRemoteDescription(
                    new RTCSessionDescription(remoteSessionDescription)
                )
                
                //if session description is offer, create an answer
                if(remoteSessionDescription.type === "offer"){
                    const connection = connections.current[peerId];
                    const answer = await connection.createAnswer();
    
                    connection.setLocalDescription(answer);
    
                    socket.current.emit(ACTIONS.RELAY_SDP, {
                        peerId, 
                        sessionDescription : answer
                    })
                }
            }

            async function setMute({mute, userId}){
                const clientIdx = clientsRef.current.map(client => client.id).indexOf(userId)
                const connectedClients = JSON.parse(JSON.stringify(clientsRef.current));
                if(clientIdx > -1){
                    connectedClients[clientIdx].muted = mute;
                    setClients(connectedClients);
    
                }
            }
        }

        initChat()

        return () => {

            localMediaStream.current.getTracks().forEach(track => track.stop())

            socket.current.emit(ACTIONS.LEAVE, {roomId})



            for (let peerId in connections.current) {
                connections.current[peerId].close();
                delete connections.current[peerId];
                delete audioElements.current[peerId];
            }

            socket.current.off(ACTIONS.ADD_PEER)
            socket.current.off(ACTIONS.REMOVE_PEER)
            socket.current.off(ACTIONS.ICE_CANDIDATE)
            socket.current.off(ACTIONS.SESSION_DESCRIPTION)
            socket.current.off(ACTIONS.MUTE);
            socket.current.off(ACTIONS.UNMUTE);
        }



    }, [])

    const provideRef = (instance, userId) => {
        audioElements.current[userId] = instance
    }


    //handle mute
    const handleMute = (isMute, userId) => {

        let settled = false;
        let interval = setInterval(() => {
            if(localMediaStream.current){
                localMediaStream.current.getTracks()[0].enabled = !isMute;
                if(isMute){
                    socket.current.emit(ACTIONS.MUTE, {
                        roomId,
                        userId
                    })
                }else{
                    socket.current.emit(ACTIONS.UNMUTE, {
                        roomId,
                        userId
                    })
                }
                settled = true;
            }
            if(settled){
                clearInterval(interval)
            }
        }, 200)

    }



  return {clients, provideRef, handleMute}
}

export default useWebRtc