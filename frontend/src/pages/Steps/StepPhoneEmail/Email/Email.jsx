import styles from "../StepPhoneEmail.module.css";
import React, {useState} from 'react'
import Card from '../../../../components/shared/card/Card';
import Button from '../../../../components/shared/button/Button';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Input from '../../../../components/shared/input/Input';
import { sendOtpEmail } from "../../../../http";
import { useDispatch } from "react-redux";
import { setOtpAsync } from "../../../../store/auth-slice";

const Email = ({onNext}) => {

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const dispatch = useDispatch()

    const submit = async () => {
        if(!email){
            setError("Please provide email-id")
            return;
        }
        try {
            const {data} = await sendOtpEmail({email})
            alert(`OTP recieved Successfully! Received OTP:  ${data.otp}`)
            dispatch(setOtpAsync({field : data.email, hash : data.hash}))
            onNext();
        } catch (error) {
            console.log(error)
        }
        
    }

    const iconStyle = {
        fontSize : "33px"
    }

  return (
    <Card title="Enter your Email Id" icon={<MailOutlineIcon style={iconStyle} />} >

        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div>
            <div style={{margin : ".75rem 0"}}>
                <Button onClick={submit} text="Next" />
            </div>
            {error && <p style={{color : "red", textAlign : "center", fontSize : "12px"}}>{error}</p>}
            <p className={styles.bottomPara}>
                By entering you number, you're agreeing to our Terms of Service and Privacy Policy. Thanks!
            </p>
        </div>

    </Card>
  )
}

export default Email