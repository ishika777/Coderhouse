import styles from "../StepPhoneEmail.module.css";
import React, {useState} from 'react'
import Card from '../../../../components/shared/card/Card'
import Button from '../../../../components/shared/button/Button'
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import Input from '../../../../components/shared/input/Input';
import { sendOtpPhone } from "../../../../http/index";
import { useDispatch } from "react-redux";
import { setOtpAsync } from "../../../../store/auth-slice";




const Phone = ({onNext}) => {

    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState("");

    const dispatch = useDispatch()

    const submit = async () => {
        if(!phoneNumber){
            setError("Please provide the phone number")
            return;
        }else if(!(phoneNumber.split('').every(char => char >= '0' && char <= '9')) || phoneNumber.length !== 10){
            setError("Please provide valid number")
            return;
        }
        try {
            const {data} = await sendOtpPhone({phone : phoneNumber})
            alert(`OTP recieved Successfully! Received OTP:  ${data.otp}`)
            dispatch(setOtpAsync({field : data.phone, hash : data.hash}))
            onNext();
        } catch (error) {
            console.log(error)
        }
        
    }

    const iconStyle = {
        fontSize : "33px"
    }


  return (
    <Card title="Enter your Phone Number" icon={<PhoneAndroidIcon style={iconStyle} />} >
        <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
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

export default Phone