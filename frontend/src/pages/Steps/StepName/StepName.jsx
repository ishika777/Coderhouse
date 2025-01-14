import styles from "./StepName.module.css"
import React, {useState} from 'react'
import MoodIcon from '@mui/icons-material/Mood';
import Card from "../../../components/shared/card/Card"
import Input from "../../../components/shared/input/Input";
import Button from "../../../components/shared/button/Button";
import { useSelector, useDispatch } from "react-redux";
import { setName } from "../../../store/activate-slice";

const StepName = ({onNext}) => {

    const data = useSelector((state) => state.activate)
    const [fullname, setFullname] = useState(data.name);
    const [error, setError] = useState("");
    const dispatch = useDispatch()

    const iconStyle = {
        fontSize : "35px"
    }

    const submit = () => {
        if(!fullname){
            setError("Please provide your name")
            return;
        }
        dispatch(setName(fullname));
        onNext();
    }

  return (
    <div className="cardWrapper">
        <Card title="Enter your Name" icon={<MoodIcon style={iconStyle} />} >
            <Input value={fullname} onChange={(e) => setFullname(e.target.value)} />
            <div>
                <p className={styles.bottomPara}>
                    People use real names at Codershouse!
                </p>
                <div className={styles.actionButtonWrap}>
                    <Button onClick={submit} text="Next" />
                </div>
                {error && <p style={{color : "red", textAlign : "center", fontSize : "12px", marginTop : "15px"}}>{error}</p>}
            </div>
        </Card>
    </div>
  )
}

export default StepName