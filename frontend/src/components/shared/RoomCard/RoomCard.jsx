import React from 'react'
import styles from "./RoomCard.module.css"
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';

const RoomCard = ({room}) => {

    const navigate = useNavigate();

    const chatStyle = {
        fontSize : "20px",
        position : "relative",
        top : "6px",
        left : "7px"
    }

    const peopleStyle = {
        fontSize : "25px",
        position : "relative",
        top : "6px",
    }


  return (
    <div onClick={() => navigate(`/room/${room.id}`)} className={styles.card}>
        <h4 className={styles.topic}>{room.topic}</h4>

        <div className={`${styles.speakers} ${room.speakers.length === 1 ? styles.singleSpeaker : ""}`}>

            <div className={styles.avatars}>
                {room.speakers.map(speaker => {
                    return <img key={speaker._id} src={speaker.avatar} alt="avatar" />
                })}
            </div>
            <div className={styles.names}>
                {room.speakers.map(speaker => {
                    return <div key={speaker.id} className={styles.nameWrapper}>
                        <span>{speaker.name}</span>
                        <ChatIcon style={chatStyle} />
                    </div>
                })}
            </div>

        </div>


        <div className={styles.peopleCount}>
            <span>{room.totalPeople}</span>
            <PersonIcon style={peopleStyle} />
        </div>


    </div>
  )
}

export default RoomCard