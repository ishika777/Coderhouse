import React, { useEffect, useState } from "react";
import styles from "./Search.module.css";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RoomCard from "../../components/shared/RoomCard/RoomCard";
import { searchRoom } from "../../http";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");
  const [rooms, setRooms] = useState(null);
  const [found, setFound] = useState(false);

  const arrowStyle = {
    color: "white",
  };

  useEffect(() => {
    const search = async () => {
      const { data } = await searchRoom({ topic: query });
      setRooms(data);
    };

    search();
  }, [query]);

  return (
    <div className="container">
      <button
        onClick={() => {
          navigate("/rooms");
        }}
        className={styles.goBack}
      >
        <ArrowBackIcon style={arrowStyle} />
        <span className={styles.heading}>All voice rooms</span>
      </button>
      <div className={styles.roomList}>
        {rooms && rooms.length > 0 ? (
          rooms.map((room) => <RoomCard key={room._id} room={room} />)
        ) : (
          <p style={{marginLeft : "4rem"}}>No room found with topic "{query}"</p> // Display this message when rooms is empty
        )}
      </div>
    </div>
  );
};

export default Search;
