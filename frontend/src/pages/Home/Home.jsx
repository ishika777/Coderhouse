import React from 'react'
import WavingHandIcon from '@mui/icons-material/WavingHand';
import styles from "./Home.module.css"
import {Link, useNavigate} from "react-router-dom"
import Card from '../../components/shared/card/Card';
import Button from '../../components/shared/button/Button';

const Home = () => {

    const Navigate = useNavigate();

    const iconStyle = {
        fontSize : "33px"
    }

    const startRegister = () => {
        Navigate("/authenticate")
    }

  return (
    <div className="cardWrapper">
        <Card title="Welcome to Codershouse!" icon={<WavingHandIcon style={iconStyle} />} >
            <p className={styles.text}>
                We're looking hard to get Codershouse ready for everyone! While we wrap up the finishing youches, we're adding people gradually to make sure nothing breaks
            </p>
            <div>
                <Button onClick={startRegister} text="Let's Go" />
            </div>
            <div className={styles.signInWrapper}>
                <span className={styles.hasInvite}>Have an invite link?</span>
            </div>
        </Card>
        
    </div>
  )
}

export default Home