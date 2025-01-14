import WavingHandIcon from '@mui/icons-material/WavingHand';
import {Link} from "react-router-dom"
import React from 'react'
import styles from "./Navigation.module.css"
import { logout } from '../../../http';
import { setAuth, setOtp } from '../../../store/auth-slice';
import {setName, setAvatar} from "../../../store/activate-slice"
import { useDispatch, useSelector } from 'react-redux';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

const Naviagtion = () => {

    const dispatch = useDispatch()
    const {isAuth, user} = useSelector((state) => state.auth)

    const brandStyle = {
        color : "#fff",
        textDecoration : "none",
        fontWeight : "bold",
        fontSize : "20px",
        display : "flex",
        alignItems : "center"
    }

    const logoText = {
        marginLeft : "10px"
    }

    const logoutUser = async () => {
        try {
            const {data} = await logout();
        
            dispatch(setAuth(data))
            dispatch(setOtp({field : '', hash : ''}))
            dispatch(setName(""))
            dispatch(setAvatar(""))

        } catch (error) {
            console.log(error)
        }
    }


  return (
    <nav className={`${styles.navbar} container`}>
        <Link style={brandStyle} className='wavingHnad' to="/">
            <WavingHandIcon /><span style={logoText}>CodersHouse</span>
        </Link>
        {isAuth && (
            <div className={styles.navRight}>
            {user.name && <h3>{user.name}</h3>}
            
            <Link to="/">
                <img className={styles.avatar} src={user.avatar ? user.avatar : "/images/avatar.png"} width="40" height="40" alt="avatar" />
            </Link>
            
            <button className={styles.logoutButton} onClick={logoutUser}>{<ArrowOutwardIcon />}</button>
        </div>
        )}
    </nav>
  )
}



export default Naviagtion