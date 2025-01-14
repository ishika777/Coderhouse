import styles from "./StepOtp.module.css"
import React, {useState} from 'react'
import Card from "../../../components/shared/card/Card"
import Button from "../../../components/shared/button/Button"
import LockIcon from '@mui/icons-material/Lock';
import Input from "../../../components/shared/input/Input";
import { verifyOtp } from "../../../http";
import { useSelector, useDispatch } from "react-redux";
import { setAuth } from "../../../store/auth-slice";

const StepOtp = ({onNext}) => {

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");

    const dispatch = useDispatch()
    const {field, hash} = useSelector((state) => state.auth.otp);

    const submit = async () => {
        if(!otp || !field || !hash){
            setError("Please provide OTP")
            return;
        }else if(!(otp.split('').every(char => char >= '0' && char <= '9')) || otp.length !== 4){
            setError("Please provide valid OTP")
            return;
        }
        try {
            const {data} = await verifyOtp({otp, field, hash})
            dispatch(setAuth(data))
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <>
      <div className="cardWrapper">
        <Card title="Enter the OTP" icon={<LockIcon />} >
            <Input value={otp} onChange={(e) => setOtp(e.target.value)} />
            <div>
                <div className={styles.actionButtonWrap}>
                    <Button onClick={submit} text="Next" />
                </div>
                {error && <p style={{color : "red", textAlign : "center", fontSize : "12px", marginTop : "15px"}}>{error}</p>}
                <p className={styles.bottomPara}>
                    By entering you number, you're agreeing to our Terms of Service and Privacy Policy. Thanks!
                </p>
            </div>
        </Card>
      </div>
    </>
  )
}

export default StepOtp