import React, { useState, useEffect } from 'react'
import styles from "./AddRoomModal.module.css"
import Input from "../../components/shared/input/Input"
import CelebrationIcon from '@mui/icons-material/Celebration';
import ClearIcon from '@mui/icons-material/Clear';
import { createRoom as create } from '../../http';
import {useNavigate} from "react-router-dom" 

const AddRoomModal = ({onClose}) => {

    const [roomType, setRoomType] = useState("open")
    const [topic, setTopic] = useState("")
    const navigate = useNavigate();

    const celebrateStyle = {
        marginRight : "10px",
        fontSize : "30px"
    }

    const closeStyle = {
        fontSize : "25px",
        fontWeight : "bold",
        cursor : "pointer",
    }

    const createRoom = async () => {
        try {
            if(!topic) return;
            const {data} = await create({topic, roomType});
            navigate(`/room/${data.id}`)
        } catch (error) {
            console.log(error.message)
        }
    }

  return (
    <div className={styles.modalMask}>
        <div className={styles.modalBody}>

            <button onClick={onClose} className={styles.closeButton}><i style={closeStyle} className="fa-solid fa-xmark"></i></button>

            <div className={styles.modalHeader}>
                <h3 className={styles.heading}>Enter the topic to be discussed</h3>
                <Input value={topic} onChange={(e) => setTopic(e.target.value)} fullwidth="true"/>
                <h3 className={styles.subHeading}>Room type</h3>
                <div className={styles.roomTypes}>

                    <div onClick={() => setRoomType("open")} className={`${styles.typeBox} ${roomType === "open" ? styles.active : ""}`}>
                        <img src="/images/Globe.png" alt="globe" />
                        <span>Open</span>
                    </div>

                    <div onClick={() => setRoomType("social")} className={`${styles.typeBox} ${roomType === "social" ? styles.active : ""}`}>
                        <img src="/images/Users.png" alt="social" />
                        <span>Social</span>
                    </div>

                    <div onClick={() => setRoomType("private")} className={`${styles.typeBox} ${roomType === "private" ? styles.active : ""}`}>
                        <img src="/images/Lock.png" alt="lock" />
                        <span>Private</span>
                    </div>
                </div>

            </div>
            <div className={styles.modalFooter}>
                <h4>Start a room, open to everyone</h4>
                
                <button onClick={createRoom} className={styles.footerButton}><CelebrationIcon style={celebrateStyle} /> Let's Go</button>
            </div>
        </div>
    </div>
  )
}

export default AddRoomModal