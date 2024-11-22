import React, {useEffect, useState} from 'react'
import styles from "./Room.module.css"
import useWebRtc from '../../hooks/useWebRtc'
import useStateWithCallback from '../../hooks/useStateWithCallback'
import {useParams, useNavigate} from "react-router-dom"
import {useSelector} from "react-redux"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BackHandIcon from '@mui/icons-material/BackHand';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { getRoom } from '../../http'


const Room = () => {

    const {id : roomId} = useParams();
    const user = useSelector(state => state.auth.user)
    const [room, setRoom] = useState(null)
    const [isMute, setMute] = useState(true);
    const {clients, provideRef, handleMute} = useWebRtc(roomId, user);
    const navigate = useNavigate();

    const arrowStyle = {
        color : "white"
    }

    const handStyle = {
        marginRight : "10px"
    }

    const handleManualLeave = () => {
        navigate("/rooms")
    }

    useEffect(() => {
        handleMute(isMute, user.id);
    }, [isMute])

    useEffect(() => {
        const fetchRoom = async() => {
            const {data} = await getRoom(roomId);
            setRoom((prev) => data);
        }

        fetchRoom();
    }, [roomId])


    const handleMuteClick = (clientId) => {

        if(clientId !== user.id) return; //cannot mute another person

        setMute((prev) => !prev)
    }


  return (
    <div>
        <div className="container">
            <button onClick={handleManualLeave} className={styles.goBack}>
                <ArrowBackIcon style={arrowStyle} />
                <span>All voice rooms</span>
            </button>
        </div>

        <div className={styles.clientsWrap}>

            <div className={styles.header}>
                <h2 className={styles.topic}>{room?.topic}</h2>
                {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
                <div className={styles.actions}>
                    <button className={styles.actionBtn}><BackHandIcon  /></button>
                    <button onClick={handleManualLeave} className={styles.actionBtn}><ThumbUpIcon style={handStyle} /><span>Leave Quietly</span></button>
                </div>
            </div>

            <div className={styles.clientsList}>
                {
                    clients.map(client => {
                        return( 
                            <div className={styles.client} key={client.id}>

                                <div className={styles.userHead}>

                                    <audio ref={(instance) => provideRef(instance, client.id)} autoPlay></audio>
                                    <img className={styles.userAvatar} src={client.avatar} alt="avatar" />

                                    <button onClick={() => handleMuteClick(client.id)} className={styles.micBtn}>
                                        {
                                            client.muted ? <MicOffIcon /> : <MicIcon />
                                        }
                                    </button>
                                    
                                </div>
                                
                                <h4>{client.name}</h4>

                            </div>
                        )
                        
                    })
                }
            </div>

        </div>

    </div>
  )
}

export default Room