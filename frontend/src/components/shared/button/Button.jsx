import styles from "./Button.module.css"
import React from 'react'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Button = ({text, onClick}) => {

    const arrowStyle = {
        marginLeft : "10px",
        fontSize : "20px"
    }

  return (
    <button onClick={onClick} className={styles.button}>
        <span>{text}</span>
        <ArrowForwardIosIcon style={arrowStyle} />
    </button>
  )
}

export default Button