import styles from "./Rooms.module.css"
import React, { useEffect } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import RoomCard from "../../components/shared/RoomCard/RoomCard";
import AddRoomModal from "../../components/AddRoomModal/AddRoomModal";
import { useState } from "react";
import { getAllRooms } from "../../http";
import { useNavigate } from "react-router-dom";

// const roomsList = [
//     {
//         id : 1,
//         topic : "Which framework best for frontend?",
//         speakers : [
//             {
//                 id : 11,
//                 name : "John Doe",
//                 avatar : "/images/avatar.png"
//             },
//             {
//                 id : 12,
//                 name : "John Doe",
//                 avatar : "/images/avatar.png"
//             }
//         ],
//         totalPeople : 40,
//     }, 
//     {
//         id : 2,
//         topic : "What's new in machine learning?",
//         speakers : [
//             {
//                 id : 13,
//                 name : "John Doe",
//                 avatar : "/images/avatar.png"
//             },
//             {
//                 id : 14,
//                 name : "John Doe",
//                 avatar : "/images/avatar.png"
//             }
//         ],
//         totalPeople : 12,
//     }, 
//     {
//         id : 3,
//         topic : "Which framework best for frontend?",
//         speakers : [
//             {
//                 id : 15,
//                 name : "John Doe",
//                 avatar : "/images/avatar.png"
//             },
//             {
//                 id : 16,
//                 name : "John Doe",
//                 avatar : "/images/avatar.png"
//             }
//         ],
//         totalPeople : 40,
//     }, 
//     {
//         id : 4,
//         topic : "Which framework best for frontend?",
//         speakers : [
//             {
//                 id : 17,
//                 name : "John Doe",
//                 avatar : "/images/avatar.png"
//             },
//             {
//                 id : 18,
//                 name : "John Doe",
//                 avatar : "/images/avatar.png"
//             }
//         ],
//         totalPeople : 40,
//     }
// ]

const Rooms = () => {

    const [showModal, setShowModal] = useState(false)
    const [roomsList, setRoomsList] = useState([]);
    const [query, setQuery] = useState('');
    const navigate = useNavigate()

    useEffect(() => {
        const fetchRooms = async() => {
            const {data} = await getAllRooms();
            setRoomsList(data)
        }
        fetchRooms();
    }, [])


    const openModal = () => {
        setShowModal(true)
    }

    const handleSearch = (e) => {
        e.preventDefault(); 
        setQuery("")
        navigate(`/room/search?query=${query}`);

    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {  // Check if Enter key is pressed
          e.preventDefault();  // Prevent default action (form submission)
          handleSearch(e);  // Trigger form submission logic
        }
      };

  return (
    <>
        <div className="container">

            <div className={styles.roomsHeader}>
                <div className={styles.left}>
                    <span className={styles.heading}>All voice rooms</span>
                    <form onSubmit={handleSearch}>
                        <div className={styles.searchBox}>
                            <SearchIcon />
                            <input 
                                type="text" 
                                className={styles.searchInput} 
                                value={query}  // bind the input value to state
                                onChange={(e) => setQuery(e.target.value)}  // update state on input change
                                onKeyDown={handleKeyPress}  // Listen for Enter key press
                            />
                        </div>
                    </form>
                </div>
                <div className={styles.right}>
                    <button onClick={openModal} className={styles.startRoomButton}>
                        <RecordVoiceOverIcon />
                        <span>Start a room</span>
                    </button>
                </div>
            </div>

            <div className={styles.roomList}>
                {
                    roomsList.map(room => {
                        return <RoomCard key={room.id} room={room} />
                    })
                }
            </div>
        </div>

        {showModal && <AddRoomModal onClose={() => setShowModal(false)} />}
    </>
  )
}

export default Rooms